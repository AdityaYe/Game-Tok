const env = require("./env");

const secureCookie =
  env.cookieSecure === "true" ||
  (env.nodeEnv === "production" && env.clientUrl?.startsWith("https://"));

const cookieOptions = {
  httpOnly: true,

  secure: secureCookie,

  sameSite: secureCookie ? "none" : "lax",

  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  cookieOptions,
};
