const express = require("express");

const router = express.Router();

const {
  searchGames,
} = require("../services/igdb.service");



router.get("/search", async (req, res) => {

  try {

    const query = req.query.q;

    const games =
      await searchGames(query);

    res.json(games);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to search games",
    });

  }

});



module.exports = router;