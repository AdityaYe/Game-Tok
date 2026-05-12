const express = require("express");

const router = express.Router();

const searchController = require("../controllers/search.controller");
const asyncHandler = require("../utils/asyncHandler");

router.get(
  "/",

  asyncHandler(searchController.searchAll),
);

router.get(
  "/trending-tags",

  asyncHandler(searchController.getTrendingTags),
);

module.exports = router;
