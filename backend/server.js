require("dotenv").config();

const http = require("http");

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = require("./src/app");

const connectDB = require("./src/db/db");

const {
  registerNotificationEvents,
} = require("./src/events/notifcation.events");

const env = require("./src/config/env");

const logger = require("./src/config/logger");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    credentials: true,
  },
});

function getCookieValue(cookieHeader = "", name) {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

io.use((socket, next) => {
  try {
    const token = getCookieValue(socket.handshake.headers.cookie, "token");

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(decodeURIComponent(token), env.jwtSecret);

    socket.userId = decoded.id;

    return next();
  } catch (err) {
    return next(new Error("Invalid socket token"));
  }
});

io.on(
  "connection",

  (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.join(`user:${socket.userId}`);

    socket.on(
      "disconnect",

      () => {
        logger.info(`Disconnected: ${socket.id}`);
      },
    );
  },
);

app.set("io", io);

registerNotificationEvents(io);

async function startServer() {
  try {
    await connectDB();

    server.listen(
      env.port,

      () => {
        logger.info(`Server running on port ${env.port}`);
      },
    );
  } catch (err) {
    logger.error("Failed to start server", err);

    process.exit(1);
  }
}

startServer();

process.on(
  "SIGTERM",

  () => {
    logger.info("SIGTERM received");

    server.close(() => {
      logger.info("Server closed");

      process.exit(0);
    });
  },
);

process.on(
  "uncaughtException",

  (err) => {
    logger.error("Uncaught Exception", err);

    process.exit(1);
  },
);

process.on(
  "unhandledRejection",

  (err) => {
    logger.error("Unhandled Rejection", err);

    process.exit(1);
  },
);
