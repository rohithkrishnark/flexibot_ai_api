require("dotenv").config({ quiet: true });

const express = require("express");
const http = require("http");
const cors = require("cors");

const corsConfig = require("./config/cors");
const { initSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);

// middlewares
app.use(cors(corsConfig));
app.use(express.json());

// init socket
initSocket(server);

// routes
const userRoutes = require("./api/UserContorller/usercontroller.router");
const socketMiddleware = require('../flexibot_ai_api/MiddleWare/socke.middlewar');
const routeTrackerMiddleware = require("./MiddleWare/routeTracker.middleware");

// socket allowed only here
app.use("/api/user", routeTrackerMiddleware("USER_LOGIN_ROUTER"), socketMiddleware, userRoutes);

// health check
app.get("/health", (_, res) => res.send("OK"));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
