const authService = require("../services/auth.service");

const { cookieOptions } = require("../config/cookie");

const ApiResponse = require("../utils/ApiResponse");

async function registerUser(req, res) {
  const { user, token } =
    await authService.registerUser({
      ...req.body,
      isCreator: false,
    });

  res
    .cookie("token", token, cookieOptions)
    .status(201)
    .json(
      new ApiResponse(
        201,
        "User registered successfully",
        {
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
          },
        }
      )
    );
}

async function loginUser(req, res) {
  const { user, token } =
    await authService.loginUser({
      ...req.body,
      isCreator: false,
    });

  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User logged in successfully",
        {
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
          },
        }
      )
    );
}

function logoutUser(req, res) {
  res
    .clearCookie("token", cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User logged out successfully"
      )
    );
}

async function registerCreator(req, res) {
  const { user, token } =
    await authService.registerUser({
      fullName: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isCreator: true,
    });

  res
    .cookie("token", token, cookieOptions)
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Creator registered successfully",
        {
          creator: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            isCreator: user.isCreator,
          },
        }
      )
    );
}

async function loginCreator(req, res) {
  const { user, token } =
    await authService.loginUser({
      ...req.body,
      isCreator: true,
    });

  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Creator logged in successfully",
        {
          creator: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            isCreator: user.isCreator,
          },
        }
      )
    );
}

function logoutCreator(req, res) {
  res
    .clearCookie("token", cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Creator logged out successfully"
      )
    );
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,

  registerCreator,
  loginCreator,
  logoutCreator,
};