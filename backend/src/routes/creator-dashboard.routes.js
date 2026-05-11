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
const asyncHandler = require("../utils/asyncHandler");



router.get(
  "/",
  asyncHandler(authCreatorMiddleware,
  getCreatorDashboard)
);

router.put(
  "/:clipId",
  asyncHandler(authCreatorMiddleware,
  updateClip)
);

router.delete(
  "/:clipId",
  asyncHandler(authCreatorMiddleware,
  deleteClip)
);



module.exports = router;