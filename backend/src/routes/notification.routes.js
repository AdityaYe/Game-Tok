const express = require("express");

const router = express.Router();
const {getNotifications} = require("../controllers/notification.controller");
const {authMiddleware,} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

router.get("/",authMiddleware, asyncHandler(getNotifications));

module.exports = router;