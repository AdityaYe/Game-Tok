const express = require("express");

const creatorController = require("../controllers/creator.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


/*
GET /api/creator/:id
Get creator profile
*/
router.get(
  "/:id",
  authMiddleware.authUserMiddleware,
  creatorController.getCreatorById
);

module.exports = router;