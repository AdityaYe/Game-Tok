const axios = require("axios");

const gameModel = require("../models/game.model");

const NodeCache = require("node-cache");

if (
  !process.env.TWITCH_CLIENT_ID ||
  !process.env.TWITCH_CLIENT_SECRET
) {
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

  const response = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      timeout: 5000,
    }
  );

  cachedToken = response.data.access_token;

  tokenExpiry =
    now + response.data.expires_in * 1000;

  return cachedToken;
}

function sanitizeQuery(query) {
  return query.replace(/"/g, "").trim();
}

async function searchGames(query) {
  const normalized =
    sanitizeQuery(query).toLowerCase();

  const cacheKey = `games:${normalized}`;

  /* =========================
     MEMORY CACHE
  ========================= */

  const memoryCache = cache.get(cacheKey);

  if (memoryCache) {
    console.log("NODE CACHE HIT");

    return memoryCache;
  }

  /* =========================
     DATABASE CACHE
  ========================= */

  const existingGames = await gameModel
    .find({
      name: {
        $regex: normalized,
        $options: "i",
      },
    })
    .limit(8)
    .lean();

  if (existingGames.length > 0) {
    console.log("MONGO CACHE HIT");

    cache.set(cacheKey, existingGames);

    return existingGames;
  }

  /* =========================
     IGDB API FALLBACK
  ========================= */

  console.log("IGDB API CALL");

  const token = await getAccessToken();

  const response = await igdbClient.post(
    "/games",
    `
    search "${normalized}";
    
    fields
      id,
      name,
      slug,
      rating;

    limit 8;
    `,
    {
      headers: {
        "Client-ID":
          process.env.TWITCH_CLIENT_ID,

        Authorization: `Bearer ${token}`,
      },
    }
  );

  const formattedGames = response.data.map(
    (game) => ({
      igdbId: game.id,

      name: game.name,

      slug: game.slug,

      rating: game.rating || 0,

      website: `https://www.igdb.com/games/${game.slug}`,
    })
  );

  if (formattedGames.length > 0) {
    try {
      await gameModel.insertMany(
        formattedGames,
        {
          ordered: false,
        }
      );
    } catch (err) {
      console.error(
        "Failed to cache games:",
        err.message
      );
    }
  }

  cache.set(cacheKey, formattedGames);

  return formattedGames;
}

module.exports = {
  searchGames,
};