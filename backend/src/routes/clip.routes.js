const express = require("express");

const clipController = require("../controllers/clip.controller");
const {authUserMiddleware,authCreatorMiddleware} = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const asyncHandler = require("../utils/asyncHandler");
const {createClipSchema,commentSchema} = require("../validators/clip.validator");

const router = express.Router();

router.post("/",authCreatorMiddleware, validate(createClipSchema), upload.single("clip"),asyncHandler(clipController.createClip),);
router.get("/", authUserMiddleware, asyncHandler(clipController.getClips));
router.post("/:clipId/like", authUserMiddleware, asyncHandler(clipController.likeClip),);
router.post("/:clipId/save", authUserMiddleware,asyncHandler(clipController.saveClip),);
router.get("/saved", authUserMiddleware,asyncHandler(clipController.getSavedClips));
router.get("/:clipId/comments", asyncHandler(clipController.getComments));
router.post("/:clipId/comments",authUserMiddleware,asyncHandler(clipController.addComment),);
router.delete("/comments/:commentId",authUserMiddleware, asyncHandler(clipController.deleteComment),);
router.post("/:clipId/view", authUserMiddleware,asyncHandler(clipController.trackView));
router.post("/:clipId/watch-time",authUserMiddleware,asyncHandler(clipController.trackWatchTime));

module.exports = router;
