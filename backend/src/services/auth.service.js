const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const env = require("../config/env");

const ApiError = require("../utils/ApiError");

const {
  uploadAvatar,
  uploadBanner,
  deleteMedia,
} = require("./storage.service");

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

      isCreator: true,
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
}) {

  const user =
    await userModel
      .findOne({
        email: email.toLowerCase(),
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

function normalizeSocials(socials = {}) {
  const allowedKeys = ["youtube", "twitch", "twitter", "instagram"];

  return allowedKeys.reduce((nextSocials, key) => {
    if (typeof socials[key] === "string") {
      nextSocials[key] = socials[key].trim();
    }

    return nextSocials;
  }, {});
}

async function updateProfile(user, payload = {}, files = {}) {
  if (typeof payload.fullName === "string") {
    const fullName = payload.fullName.trim();

    if (!fullName) {
      throw new ApiError(400, "Display name is required");
    }

    user.fullName = fullName;
  }

  if (typeof payload.bio === "string") {
    user.bio = payload.bio.trim();
  }

  if (payload.socials) {
    let incomingSocials = payload.socials;

    if (typeof payload.socials === "string") {
      try {
        incomingSocials = JSON.parse(payload.socials);
      } catch {
        throw new ApiError(400, "Invalid socials payload");
      }
    }

    user.socials = {
      ...(user.socials?.toObject?.() ?? user.socials ?? {}),
      ...normalizeSocials(incomingSocials),
    };
  }

  if (typeof payload.avatar === "string") {
    user.avatar = payload.avatar.trim();
  }

  if (typeof payload.banner === "string") {
    user.banner = payload.banner.trim();
  }

  const avatarFile = files.avatar?.[0];
  const bannerFile = files.banner?.[0];

  if (avatarFile) {
    if (user.avatarPublicId) {
      await deleteMedia(user.avatarPublicId);
    }

    const uploadResult = await uploadAvatar(avatarFile.buffer);
    user.avatar = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;
  }

  if (bannerFile) {
    if (user.bannerPublicId) {
      await deleteMedia(user.bannerPublicId);
    }

    const uploadResult = await uploadBanner(bannerFile.buffer);
    user.banner = uploadResult.secure_url;
    user.bannerPublicId = uploadResult.public_id;
  }

  await user.save();

  return user;
}

module.exports = {
  registerUser,

  loginUser,

  updateProfile,
};
