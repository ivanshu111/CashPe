require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const budgetRoutes = require("./routes/budgetRoutes"); // New
const expenseRoutes = require("./routes/expenseRoutes"); // New
const reportRoutes = require("./routes/reportRoutes"); // New
const categoryRoutes = require("./routes/categoryRoutes"); // New

const http = require("http");
const {
  initSocketManager,
  emitNotificationToUser,
} = require("./service/socketManager");
const { subscriber, NOTIFICATION_CHANNEL } = require("./service/redisManager");
const notificationRoutes = require("./routes/notificationRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const app = express();

const server = http.createServer(app);
initSocketManager(server);
subscriber.subscribe(NOTIFICATION_CHANNEL, (err, count) => {
  if (err) {
    console.error("Failed to subscribe to redis channel: ", err);
    return;
  }
  console.log(`Subscribed successfully to ${count} Redis channel(s).`);
});

subscriber.on("message", (channel, message) => {
  if (channel === NOTIFICATION_CHANNEL) {
    const notification = JSON.parse(message);
    emitNotificationToUser(notification.userId, notification);
  }
});

const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : "*",
  credentials: true,
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/budget", budgetRoutes); // New
app.use("/api/expenses", expenseRoutes); // New
app.use("/api/reports", reportRoutes); // New
app.use("/api/categories", categoryRoutes); // New

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
