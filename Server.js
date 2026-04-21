require("dotenv").config({ quiet: true });

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const corsConfig = require("./config/cors");
const { initSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);

// Serve the C:\uploads folder at /uploads URL
app.use("/uploads", express.static("C:/uploads"));

// middlewares
app.use(cors(corsConfig));
app.use(express.json());

// init socket
initSocket(server);

// routes
const userRoutes = require("./api/UserContorller/usercontroller.router");
const adminRoutes = require("./api/admin/admin.router");
const studentroute = require("./api/Student/student.router");
const chatroute = require("./api/Chatbot/chatbot.router");
const aluminiroute = require("./api/alumini/alumini.router");
const alertnotification = require("./api/alertsystem/alertRoutes");
const socketMiddleware = require("../flexibot_ai_api/MiddleWare/socke.middlewar");
const routeTrackerMiddleware = require("./MiddleWare/routeTracker.middleware");

// socket allowed only here
app.use(
  "/api/user",
  routeTrackerMiddleware("USER_LOGIN_ROUTER"),
  socketMiddleware,
  userRoutes,
);
app.use(
  "/api/training",
  routeTrackerMiddleware("ADMIN_PDF_TRAINING"),
  socketMiddleware,
  adminRoutes,
);
app.use(
  "/api/student",
  routeTrackerMiddleware("STUDENT_ACTIVITY_ROUTE"),
  socketMiddleware,
  studentroute,
);

app.use(
  "/api/chat",
  routeTrackerMiddleware("CHATBOT_ACTIVITY_ROUTE"),
  socketMiddleware,
  chatroute,
);

app.use(
  "/api/alumini",
  routeTrackerMiddleware("ALUMINI_ACTIVITY_ROUTE"),
  socketMiddleware,
  aluminiroute,
);


app.use(
  "/api/alertnotify",
  routeTrackerMiddleware("NOTIFICATION_ROUTE"),
  socketMiddleware,
  alertnotification,
);
// health check
app.get("/health", (_, res) => res.send("OK"));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
