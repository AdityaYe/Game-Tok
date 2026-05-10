require("dotenv").config();

const connectDB = require("./src/db/db");

connectDB();

const PORT = process.env.PORT || 3000;

const http = require("http");

const { Server } = require("socket.io");

const app = require("./src/app");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",

    credentials: true,
  },
});

io.on(
  "connection",

  (socket) => {
    console.log("User connected:", socket.id);

    socket.on(
      "join",

      (userId) => {
        socket.join(userId);
      },
    );

    socket.on(
      "disconnect",

      () => {
        console.log("Disconnected:", socket.id);
      },
    );
  },
);

app.set("io", io);

server.listen(
  process.env.PORT || 3000,

  () => {
    console.log("Server running");
  },
);
