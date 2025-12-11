const Notification = require("../models/Notification");
const { publishNotification } = require("../service/redisManager");

const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }
    const newNotification = new Notification({ userId, message });
    await newNotification.save();

    publishNotification(newNotification.toObject());

    res
      .status(201)
      .json({
        message: "Notification created successfully",
        notification: newNotification,
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
};
