const userModel = require("../models/user.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// USER REGISTER
async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

// USER LOGIN
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    res.cookie("token", token);
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
}

// CREATOR REGISTER
async function registerCreator(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingCreator = await userModel.findOne({
      email,
    });

    if (existingCreator) {
      return res.status(400).json({
        message: "Creator already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const creator = await userModel.create({
      fullName: name,
      email,
      password: hashedPassword,
      isCreator: true,
    });

    const token = generateToken(creator._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Creator registered successfully",
      creator: {
        _id: creator._id,
        fullName: creator.fullName,
        email: creator.email,
        isCreator: creator.isCreator,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

// CREATOR LOGIN
async function loginCreator(req, res) {
  try {
    const { email, password } = req.body;

    const creator = await userModel.findOne({
      email,
      isCreator: true,
    });

    if (!creator) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, creator.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(creator._id);

    res.cookie(
      "token",

      token,

      {
        httpOnly: true,

        secure: process.env.NODE_ENV === "production",

        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    );

    res.status(200).json({
      message: "Creator logged in successfully",
      creator: {
        _id: creator._id,
        fullName: creator.fullName,
        email: creator.email,
        isCreator: creator.isCreator,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

function logoutCreator(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Creator logged out successfully",
  });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,

  registerCreator,
  loginCreator,
  logoutCreator,
};
