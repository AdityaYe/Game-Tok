const express = require("express");

const router = express.Router();

const searchController = require("../controllers/search.controller");

router.get(
  "/",

  searchController.searchAll,
);

router.get(
  "/trending-tags",

  searchController.getTrendingTags,
);

module.exports = router;
