const express = require("express");

const authController = require(
  "../controllers/auth.controller"
);

const validate = require(
  "../middlewares/validate.middleware"
);

const {
  registerSchema,
  loginSchema,
} = require(
  "../validators/auth.validator"
);

const asyncHandler = require(
  "../utils/asyncHandler"
);

const router = express.Router();

router.post(
  "/user/register",
  validate(registerSchema),
  asyncHandler(authController.registerUser)
);

router.post(
  "/user/login",
  validate(loginSchema),
  asyncHandler(authController.loginUser)
);

router.get(
  "/user/logout",
  authController.logoutUser
);

router.post(
  "/creator/register",
  validate(registerSchema),
  asyncHandler(authController.registerCreator)
);

router.post(
  "/creator/login",
  validate(loginSchema),
  asyncHandler(authController.loginCreator)
);

router.get(
  "/creator/logout",
  authController.logoutCreator
);

module.exports = router;