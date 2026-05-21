const express = require("express");

const creatorController = require("../controllers/creator.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
const upload = multer();


/*
GET /api/creator/:id
Get creator profile
*/

router.get("/:id",authMiddleware, asyncHandler(creatorController.getCreatorById));
router.post("/follow",authMiddleware, asyncHandler(creatorController.followCreator))
router.put("/profile", authMiddleware, asyncHandler(creatorController.updateProfile));
router.put("/banner", authMiddleware, upload.single("banner"), asyncHandler(creatorController.updateBanner))
router.put("/avatar", authMiddleware, upload.single("avatar"), asyncHandler(creatorController.updateAvatar));

module.exports = router;
