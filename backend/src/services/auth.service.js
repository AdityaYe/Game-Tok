const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const env = require("../config/env");

const ApiError = require("../utils/ApiError");

function generateToken(id) {
  return jwt.sign(
    { id },
    env.jwtSecret,
    {
      expiresIn: "7d",
    }
  );
}

async function registerUser({
  fullName,
  email,
  password,
  isCreator = false,
}) {

  const existingUser =
    await userModel.findOne({
      email: email.toLowerCase(),
    });

  if (existingUser) {
    throw new ApiError(
      400,
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user =
    await userModel.create({
      fullName,

      email: email.toLowerCase(),

      password: hashedPassword,

      isCreator,
    });

  const token =
    generateToken(user._id);

  return {
    user,
    token,
  };
}

async function loginUser({
  email,
  password,
  isCreator = false,
}) {

  const user =
    await userModel
      .findOne({
        email: email.toLowerCase(),

        isCreator,
      })
      .select("+password");

  if (!user) {
    throw new ApiError(
      400,
      "Invalid email or password"
    );
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new ApiError(
      400,
      "Invalid email or password"
    );
  }

  const token =
    generateToken(user._id);

  return {
    user,
    token,
  };
}

module.exports = {
  registerUser,

  loginUser,
};