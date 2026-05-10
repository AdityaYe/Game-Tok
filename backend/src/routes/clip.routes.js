const express = require("express");
const clipController = require("../controllers/clip.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const creatorController = require("../controllers/creator.controller");

const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/*
POST /api/clips
Create clip
[protected creator]
*/
router.post(
  "/",
  authMiddleware.authCreatorMiddleware,
  upload.single("clip"),
  clipController.createClip,
);

/*
GET /api/clips
Get feed
[protected user]
*/
router.get("/", authMiddleware.authUserMiddleware, clipController.getClips);

/*
POST /api/clips/like
Like clip
*/
router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  clipController.likeClip,
);

router.get("/:clipId/comments", clipController.getComments);

router.post(
  "/comment",
  authMiddleware.authUserMiddleware,
  clipController.addComment,
);

router.delete(
  "/comment/:commentId",
  authMiddleware.authUserMiddleware,
  clipController.deleteComment,
);

/*
POST /api/clips/save
Save clip
*/
router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  clipController.saveClip,
);

/*
GET /api/clips/save
Get saved clips
*/
router.get(
  "/save",
  authMiddleware.authUserMiddleware,
  clipController.getSavedClips,
);

router.post(
  "/follow",
  authMiddleware.authUserMiddleware,
  creatorController.followCreator,
);

router.post(
  "/view",

  authMiddleware.authUserMiddleware,

  clipController.trackView,
);

router.post(
  "/watch-time",

  authMiddleware.authUserMiddleware,

  clipController.trackWatchTime,
);

module.exports = router;
