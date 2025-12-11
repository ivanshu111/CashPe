const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  getLoggedInUserNotifications, // Import the new function
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/auth");

// Route to create a new notification (for testing or internal use)
router.post("/", authMiddleware, createNotification);

// Route to get notification history for a specific user ID (e.g., admin view)
router.get("/:userId", authMiddleware, getUserNotifications);

// Route to get notification history for the currently logged-in user
router.get("/", authMiddleware, getLoggedInUserNotifications); // New route

module.exports = router;
