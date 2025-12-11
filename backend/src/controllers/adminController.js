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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
    });
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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalTransactions = await Transaction.countDocuments();
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await Transaction.find()
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      transactions,
      currentPage: page,
      totalPages,
      totalTransactions,
    });
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
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 1. Get User Profile
    const user = await User.findById(userId).select("-password -pin");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Get User Wallet
    const wallet = await Wallet.findOne({ user: userId });

    // 3. Get User Transactions (with pagination)
    const transactionQuery = { $or: [{ fromUser: userId }, { toUser: userId }] };
    const totalTransactions = await Transaction.countDocuments(transactionQuery);
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await Transaction.find(transactionQuery)
      .sort({ createdAt: -1 })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      user,
      wallet,
      transactions: {
        data: transactions,
        currentPage: page,
        totalPages,
        totalTransactions,
      },
    });

  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
};
