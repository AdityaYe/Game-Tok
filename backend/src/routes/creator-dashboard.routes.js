const express = require("express");

const router = express.Router();

const {getCreatorDashboard, updateClip, deleteClip} = require("../controllers/creator-dashboard.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

router.get("/", authMiddleware, asyncHandler(getCreatorDashboard));
router.put("/:clipId", authMiddleware, asyncHandler(updateClip));
router.delete("/:clipId", authMiddleware, asyncHandler(deleteClip));

module.exports = router;
