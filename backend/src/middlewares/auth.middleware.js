const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const env = require("../config/env");

const ApiError = require("../utils/ApiError");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new ApiError(401, "Authentication required"));
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await userModel
      .findById(decoded.id)
      .select(
        "_id fullName avatar avatarPublicId banner bannerPublicId isCreator followers following followerCount followingCount socials bio isVerified",
      );

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Session expired. Please login again."));
    }

    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }

    next(err);
  }
}

module.exports = {
  authMiddleware,
};
