const express = require("express");

const router = express.Router();

const {
  getCreatorDashboard,
  updateClip,
  deleteClip
} = require(
  "../controllers/creator-dashboard.controller"
);

const {
  authCreatorMiddleware,
} = require(
  "../middlewares/auth.middleware"
);



router.get(
  "/",
  authCreatorMiddleware,
  getCreatorDashboard
);

router.put(
  "/:clipId",
  authCreatorMiddleware,
  updateClip
);

router.delete(
  "/:clipId",
  authCreatorMiddleware,
  deleteClip
);



module.exports = router;