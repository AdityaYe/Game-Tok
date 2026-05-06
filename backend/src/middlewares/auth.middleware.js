const userModel = require("../models/user.model");

const jwt = require("jsonwebtoken");


async function authCreatorMiddleware(
  req,
  res,
  next
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const creator = await userModel.findById(
      decoded.id
    );

    if (!creator || !creator.isCreator) {
      return res.status(403).json({
        message: "Creator access required",
      });
    }

    req.creator = creator;
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

async function authUserMiddleware(req, res, next) {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Please login first",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (err) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }

}


module.exports = {
  authCreatorMiddleware,
  authUserMiddleware,
};