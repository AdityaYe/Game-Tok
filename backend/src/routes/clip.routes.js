const express = require("express");

const clipController = require("../controllers/clip.controller");
const {authMiddleware,requireCreator} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate.middleware");
const { createClipSchema, commentSchema } = require("../validators/clip.validator");

const router = express.Router();

router.get("/saved", authMiddleware, asyncHandler(clipController.getSavedClips));
router.get("/:clipId/comments", asyncHandler(clipController.getComments));
router.get("/", authMiddleware, asyncHandler(clipController.getClips),);
router.post("/", authMiddleware, requireCreator, upload.single("clip"), validate(createClipSchema), asyncHandler(clipController.createClip),);
router.post("/:clipId/like", authMiddleware, asyncHandler(clipController.likeClip));
router.post("/:clipId/save", authMiddleware, asyncHandler(clipController.saveClip));
router.post("/:clipId/comments", authMiddleware, validate(commentSchema), asyncHandler(clipController.addComment),);
router.delete("/comments/:commentId", authMiddleware, asyncHandler(clipController.deleteComment));
router.post("/:clipId/view",authMiddleware, asyncHandler(clipController.trackView));
router.post("/:clipId/watch-time", authMiddleware,asyncHandler(clipController.trackWatchTime));

module.exports = router;
