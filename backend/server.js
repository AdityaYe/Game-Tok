require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/db/db");
const { Server } = require("socket.io");
const { registerNotificationEvents } = require("./src/events/notification.events");
const env = require("./src/config/env");

connectDB();

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

    console.log(
      "User connected:",
      socket.id
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
        console.log(
          "Disconnected:",
          socket.id
        );
      }
    );
  }
);

process.on(
  "SIGTERM",
  () => {

    console.log(
      "SIGTERM received"
    );

    server.close(() => {

      console.log(
        "Server closed"
      );

      process.exit(0);
    });
  }
);

app.set("io", io);

registerNotificationEvents(io);

server.listen(
  env.port,
  () => {
    console.log(
      `Server running on port ${env.port}`
    );
  }
);