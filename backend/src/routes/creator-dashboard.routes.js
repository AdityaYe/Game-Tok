const express = require("express");

const router = express.Router();

const {getCreatorDashboard, updateClip, deleteClip} = require("../controllers/creator-dashboard.controller");

const {authMiddleware, requireCreator} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

router.get("/", authMiddleware, requireCreator, asyncHandler(getCreatorDashboard));
router.put("/:clipId", authMiddleware, requireCreator, asyncHandler(updateClip));
router.delete("/:clipId", authMiddleware, requireCreator, asyncHandler(deleteClip));

module.exports = router;