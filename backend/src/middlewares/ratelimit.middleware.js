const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  message: "Too many login attempts",
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 200,

  message: "Too many requests",
});

module.exports = {
  authLimiter,

  apiLimiter,
};
