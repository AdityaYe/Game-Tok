const logger = require("../config/logger");

function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,

    stack: err.stack,

    url: req.originalUrl,

    method: req.method,
  });

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,

    message: err.message || "Internal Server Error",
  });
}

module.exports = {
  errorHandler,
};
