const express = require("express");

const creatorController = require("../controllers/creator.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const multer = require("multer");

const upload = multer();


/*
GET /api/creator/:id
Get creator profile
*/

router.get(
  "/:id",
  authMiddleware.authUserMiddleware,
  creatorController.getCreatorById
);

router.put(

  "/avatar",
  authMiddleware.authCreatorMiddleware,
  upload.single("avatar"),
  creatorController.updateAvatar
);

module.exports = router;