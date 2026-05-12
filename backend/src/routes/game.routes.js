const express = require("express");

const router = express.Router();

const { searchGames } = require("../services/igdb.service");

const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const ApiError = require("../utils/ApiError");

router.get(
  "/search",

  asyncHandler(async (req, res) => {
    const query = req.query.q?.trim();

    if (!query) {
      throw new ApiError(400, "Search query is required");
    }

    const games = await searchGames(query);

    return res.status(200).json(
      new ApiResponse(200, "Games fetched successfully", {
        games,
      }),
    );
  }),
);

module.exports = router;
