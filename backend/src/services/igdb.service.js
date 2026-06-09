const axios = require("axios");

const gameModel = require("../models/game.model");
const logger = require("../config/logger");

const NodeCache = require("node-cache");

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
  throw new Error("Missing Twitch environment variables");
}

const cache = new NodeCache({
  stdTTL: 86400,
});

const igdbClient = axios.create({
  baseURL: "https://api.igdb.com/v4",
  timeout: 5000,
});

let cachedToken = null;

let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials",
    },

    timeout: 5000,
  });

  cachedToken = response.data.access_token;

  tokenExpiry = now + response.data.expires_in * 1000;

  return cachedToken;
}

function sanitizeQuery(query) {
  return query.replace(/"/g, "").trim();
}

function buildCoverUrl(imageId, size = "t_cover_small") {
  if (!imageId) {
    return "";
  }

  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.webp`;
}

function formatGame(game) {
  return {
    igdbId: game.id ?? game.igdbId,
    name: game.name,
    slug: game.slug || "",
    cover: game.cover?.image_id
      ? buildCoverUrl(game.cover.image_id)
      : game.cover || "",
    genre: game.genres?.[0]?.name || game.genre || "",
    rating: game.rating || 0,
    website:
      game.website ||
      (game.slug ? `https://www.igdb.com/games/${game.slug}` : ""),
  };
}

function dedupeGames(games) {
  const seen = new Set();

  return games.filter((game) => {
    const key = game.igdbId || game.slug || game.name?.toLowerCase();

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function searchGames(query) {
  const normalized = sanitizeQuery(query).toLowerCase();

  if (!normalized) {
    return [];
  }

  const cacheKey = `games:${normalized}`;

  const memoryCache = cache.get(cacheKey);

  if (memoryCache) {
    logger.info("NODE CACHE HIT");

    return memoryCache;
  }

  const existingGames = await gameModel
    .find({
      name: {
        $regex: normalized,
        $options: "i",
      },
    })
    .limit(3)
    .lean();

  if (existingGames.length >= 3) {
    logger.info("MONGO CACHE HIT");

    cache.set(cacheKey, existingGames);

    return existingGames;
  }

  logger.info("IGDB API CALL");

  const token = await getAccessToken();

  const response = await igdbClient.post(
    "/games",
    `
    search "${normalized}";
    
      fields
      id,
      name,
      slug,
      rating,
      genres.name,
      cover.image_id;

    limit 3;
    `,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,

        Authorization: `Bearer ${token}`,
      },
    },
  );

  const formattedGames = response.data.map(formatGame);
  const games = dedupeGames([...existingGames, ...formattedGames]).slice(0, 3);

  cache.set(cacheKey, games);

  return games;
}

async function saveSelectedGame(game) {
  if (!game?.igdbId || !game?.name) {
    return null;
  }

  const selectedGame = formatGame(game);

  return gameModel.findOneAndUpdate(
    {
      igdbId: selectedGame.igdbId,
    },
    {
      $set: selectedGame,
    },
    {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  );
}

module.exports = {
  searchGames,
  saveSelectedGame,
};
