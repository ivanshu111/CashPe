const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/auth");

// Route to create a new notification for testing
router.post("/", authMiddleware, createNotification);

// to get notification history for a user
router.get("/:userId", authMiddleware, getUserNotifications);

module.exports = router;
