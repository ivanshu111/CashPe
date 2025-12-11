const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet"); // Import Wallet model
const Notification = require("../models/Notification"); // Import Notification model
const { publishNotification } = require("../service/redisManager"); // Import notification service

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from the results
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/admin/transactions
// @desc    Get all transactions
// @access  Admin
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("fromUser", "name email") // Populate sender with name and email
      .populate("toUser", "name email"); // Populate receiver with name and email
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT /api/admin/users/:userId/status
// @desc    Update user status (freeze/unfreeze)
// @access  Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { userId } = req.params;

    if (!status || !["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({
          msg: "Invalid status provided. Must be 'active' or 'inactive'.",
        });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({
      msg: `User ${user.email} account has been set to '${status}'.`,
    });

    // --- Create and Publish Notification ---
    try {
      const statusText = status === "inactive" ? "frozen" : "activated";
      const notificationMessage = `Your account has been ${statusText} by an administrator.`;
      
      const notification = new Notification({
        userId: user._id,
        message: notificationMessage,
      });
      await notification.save();
      publishNotification(notification.toObject());

    } catch (notificationError) {
      console.error(
        "Error creating status change notification:",
        notificationError
      );
      // We don't send a response here as the primary action was successful
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/admin/users/:userId/details
// @desc    Get detailed view of a single user (profile, wallet, transactions)
// @access  Admin
exports.getDetailedUserView = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Get User Profile
    const user = await User.findById(userId).select("-password -pin"); // Exclude sensitive info
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Get User Wallet
    const wallet = await Wallet.findOne({ user: userId });

    // 3. Get User Transactions
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("fromUser", "name email")
      .populate("toUser", "name email");

    res.status(200).json({
      user,
      wallet,
      transactions,
    });

  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
};
