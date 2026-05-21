const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const { errorHandler } = require("./middlewares/error.middleware");
const {
  authLimiter,
  apiLimiter,
} = require("./middlewares/ratelimit.middleware");
const requestIdMiddleware = require("./middlewares/requestId.middleware");

const authRoutes = require("./routes/auth.routes");
const clipRoutes = require("./routes/clip.routes");
const creatorRoutes = require("./routes/creator.routes");
const gameRoutes = require("./routes/game.routes");
const creatorDashboardRoutes = require("./routes/creator-dashboard.routes");
const searchRoutes = require("./routes/search.routes");
const notificationRoutes = require("./routes/notification.routes");
const env = require("./config/env");

const app = express();

const API_PREFIX = "/api/v1";

const allowedOrigins = [env.clientUrl];

app.use(
  cors({
    origin: allowedOrigins,

    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  pinoHttp({
    logger,
  }),
);
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(requestIdMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(hpp());
app.use(express.urlencoded({ extended: true }));
app.use(
  `${API_PREFIX}/auth`,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
  }),
);

app.use(apiLimiter);
app.use(`${API_PREFIX}/auth`, authLimiter);
app.get("/", (req, res) => {
  res.send("GameTok API Running");
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/clips`, clipRoutes);
app.use(`${API_PREFIX}/dashboard`, creatorDashboardRoutes);
app.use(`${API_PREFIX}/creator/dashboard`, creatorDashboardRoutes);
app.use(`${API_PREFIX}/creator`, creatorRoutes);
app.use(`${API_PREFIX}/games`, gameRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);

app.use(errorHandler);
app.disable("x-powered-by");

module.exports = app;
