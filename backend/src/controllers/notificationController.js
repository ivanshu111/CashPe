const Notification = require("../models/Notification");
const { publishNotification } = require("../service/redisManager");

// This function is for creating a notification manually via an API endpoint.
// In practice, you'll call publishNotification from other controllers (see Step 8).
const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res
        .status(400)
        .json({ error: "userId and message are required." });
    }

    const newNotification = new Notification({ userId, message });
    await newNotification.save();

    // Publish the notification to Redis. The subscriber in app.js will handle sending it.
    publishNotification(newNotification.toObject());

    res
      .status(201)
      .json({
        message: "Notification created successfully.",
        notification: newNotification,
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

// Gets notification history for a specific user (by ID in params)
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

// Gets notification history for the currently logged-in user
const getLoggedInUserNotifications = async (req, res) => {
  try {
    // userId is available from req.user._id thanks to the auth middleware
    const userId = req.user._id;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching logged-in user's notifications:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  getLoggedInUserNotifications, // Export the new function
};
