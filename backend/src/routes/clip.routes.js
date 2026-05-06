const express = require("express");
const clipController = require("../controllers/clip.controller");
const authMiddleware = require("../middlewares/auth.middleware");

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
  clipController.createClip
);


/*
GET /api/clips
Get feed
[protected user]
*/
router.get(
  "/",
  authMiddleware.authUserMiddleware,
  clipController.getClips
);


/*
POST /api/clips/like
Like clip
*/
router.post(
  "/like",
  authMiddleware.authUserMiddleware,
  clipController.likeClip
);


/*
POST /api/clips/save
Save clip
*/
router.post(
  "/save",
  authMiddleware.authUserMiddleware,
  clipController.saveClip
);


/*
GET /api/clips/save
Get saved clips
*/
router.get(
  "/save",
  authMiddleware.authUserMiddleware,
  clipController.getSavedClips
);

module.exports = router;