const express = require("express");

const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/:id/follow", authMiddleware, asyncHandler(userController.followUser));
router.delete("/:id/follow", authMiddleware, asyncHandler(userController.unfollowUser));

module.exports = router;
