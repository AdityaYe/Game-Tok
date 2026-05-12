const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const env = require("../config/env");

const ApiError = require("../utils/ApiError");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  const decoded = jwt.verify(token, env.jwtSecret);

  const user = await userModel
    .findById(decoded.id)
    .select(
      "_id fullName avatar isCreator followers following socials bio banner",
    );

  if (!user) {
    return next(new ApiError(401, "User not found"));
  }

  req.user = user;

  next();
}

function requireCreator(req, res, next) {
  if (!req.user.isCreator) {
    return next(new ApiError(403, "Creator access required"));
  }

  next();
}

module.exports = {
  authMiddleware,
  requireCreator,
};
