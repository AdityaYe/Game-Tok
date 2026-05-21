const authService = require("../services/auth.service");

const { cookieOptions } = require("../config/cookie");

const ApiResponse = require("../utils/ApiResponse");

function serializeUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    isCreator: user.isCreator,
    avatar: user.avatar,
    banner: user.banner,
    bio: user.bio,
    socials: user.socials,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    followers: user.followers,
    following: user.following,
    isVerified: user.isVerified,
  };
}

async function registerUser(req, res) {
  const { user, token } = await authService.registerUser({
    ...req.body,
    fullName: req.body.fullName,
  });

  res
    .cookie("token", token, cookieOptions)
    .status(201)
    .json(
      new ApiResponse(201, "User registered successfully", {
        user: serializeUser(user),
      }),
    );
}

async function getMe(req, res) {
  return res.status(200).json({
    success: true,

    user: req.user,
  });
}

async function loginUser(req, res) {
  const { user, token } = await authService.loginUser({
    ...req.body,
  });

  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: serializeUser(user),
      }),
    );
}

async function updateProfile(req, res) {
  const user = await authService.updateProfile(
    req.user,
    req.body,
    req.files,
  );

  return res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", {
      user: serializeUser(user),
    }),
  );
}

function logoutUser(req, res) {
  res
    .clearCookie("token", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
};
