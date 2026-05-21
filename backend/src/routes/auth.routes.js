const express = require("express");

const authController = require("../controllers/auth.controller");

const validate = require("../middlewares/validate.middleware");

const { authMiddleware } = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

const { registerSchema, loginSchema } = require("../validators/auth.validator");

const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  asyncHandler(authController.getMe),
);

router.patch(
  "/profile",
  authMiddleware,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  asyncHandler(authController.updateProfile),
);

router.post(
  "/user/register",
  validate(registerSchema),
  asyncHandler(authController.registerUser),
);

router.post(
  "/user/login",
  validate(loginSchema),
  asyncHandler(authController.loginUser),
);

router.post("/logout", authController.logoutUser);
router.get("/user/logout", authController.logoutUser);

module.exports = router;
