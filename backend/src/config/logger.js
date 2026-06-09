const pino = require("pino");

const logger =
  process.env.NODE_ENV === "production"
    ? pino({
        level: "info",
      })
    : pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });

module.exports = logger;