require("dotenv").config();

const http = require("http");

const { Server } = require("socket.io");

const app = require("./src/app");

const connectDB = require("./src/db/db");

const {
  registerNotificationEvents,
} = require(
  "./src/events/notifcation.events"
);

const env = require("./src/config/env");

const logger = require(
  "./src/config/logger"
);

const server =
  http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.clientUrl,

    credentials: true,
  },
});

io.on(
  "connection",

  (socket) => {

    logger.info(
      `User connected: ${socket.id}`
    );

    socket.on(
      "join",

      (userId) => {
        socket.join(userId);
      }
    );

    socket.on(
      "disconnect",

      () => {

        logger.info(
          `Disconnected: ${socket.id}`
        );
      }
    );
  }
);

app.set("io", io);

registerNotificationEvents(io);

async function startServer() {

  try {

    await connectDB();

    server.listen(
      env.port,

      () => {

        logger.info(
          `Server running on port ${env.port}`
        );
      }
    );

  } catch (err) {

    logger.error(
      "Failed to start server",
      err
    );

    process.exit(1);
  }
}

startServer();

process.on(
  "SIGTERM",

  () => {

    logger.info(
      "SIGTERM received"
    );

    server.close(() => {

      logger.info(
        "Server closed"
      );

      process.exit(0);
    });
  }
);

process.on(
  "uncaughtException",

  (err) => {

    logger.error(
      "Uncaught Exception",
      err
    );

    process.exit(1);
  }
);

process.on(
  "unhandledRejection",

  (err) => {

    logger.error(
      "Unhandled Rejection",
      err
    );

    process.exit(1);
  }
);