// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const clipRoutes = require('./routes/clip.routes');
const creatorRoutes = require('./routes/creator.routes');
const gameRoutes = require("./routes/game.routes");
const creatorDashboardRoutes = require("./routes/creator-dashboard.routes")
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || API_BASE_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GameTok API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/clips", clipRoutes);
app.use("/api/creator/dashboard", creatorDashboardRoutes);
app.use("/api/creator", creatorRoutes);
app.use("/api/games", gameRoutes);

module.exports = app;