const express = require("express");

const router = express.Router();
const {
  getNotifications,
  markNotificationsRead,
} = require("../controllers/notification.controller");
const {authMiddleware,} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

router.get("/",authMiddleware, asyncHandler(getNotifications));
router.post("/read",authMiddleware, asyncHandler(markNotificationsRead));

module.exports = router;
