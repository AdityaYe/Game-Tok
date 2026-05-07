const axios = require("axios");

const gameModel = require("../models/game.model");

const NodeCache =
  require("node-cache");

const cache =
  new NodeCache({
    stdTTL: 86400,
  });



let cachedToken = null;

let tokenExpiry = 0;



async function getAccessToken() {

  const now = Date.now();

  if (
    cachedToken &&
    now < tokenExpiry
  ) {
    return cachedToken;
  }

  const response = await axios.post(
    "https://id.twitch.tv/oauth2/token",
    null,
    {
      params: {
        client_id:
          process.env.TWITCH_CLIENT_ID,

        client_secret:
          process.env.TWITCH_CLIENT_SECRET,

        grant_type:
          "client_credentials",
      },
    }
  );

  console.log(response.data)

  cachedToken =
    response.data.access_token;

  tokenExpiry =
    now + (
      response.data.expires_in * 1000
    );

  return cachedToken;

}



async function searchGames(query) {

  const normalized =
    query.toLowerCase().trim();



  /* =========================
     CHECK DATABASE FIRST
  ========================= */

  const existingGames =
    await gameModel.find({

      name: {
        $regex: normalized,
        $options: "i",
      },

    }).limit(8);



  if (existingGames.length > 0) {

    console.log("MONGO CACHE HIT");

    return existingGames;

  }
 /* =========================
     FALLBACK TO IGDB
  ========================= */

  console.log("IGDB API CALL");



  const token =
    await getAccessToken();



  const response = await axios.post(

    "https://api.igdb.com/v4/games",

    `
    search "${query}";
    
    fields
    id,
    name,
    slug,
    rating,
    
    limit 8;
    `,

    {
      headers: {

        "Client-ID":
          process.env.TWITCH_CLIENT_ID,

        Authorization:
          `Bearer ${token}`,

      },
    }
  );

 const formattedGames =
    response.data.map((game) => ({

       igdbId: game.id,

      name: game.name,

      slug: game.slug,

      rating:
        game.rating || 0,

      website:
        `https://www.igdb.com/games/${game.slug}`

    }));

     if (formattedGames.length > 0) {

    await gameModel.insertMany(

      formattedGames,

      {
        ordered: false,
      }

    ).catch(() => {});

  }

   return formattedGames;

}

module.exports = {
  searchGames,
};