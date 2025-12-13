const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password -pin"); // Exclude sensitive info
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Admin
exports.getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({})
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (active/inactive)
// @route   PUT /api/admin/users/:userId/status
// @access  Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'active' or 'inactive'

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "User status updated successfully.", user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get consolidated, detailed view of a single user
// @route   GET /api/admin/users/:userId/details
// @access  Admin
exports.getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -pin");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const wallet = await Wallet.findOne({ user: userId });
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ user: { ...user.toObject(), wallet, transactions } });
  } catch (error) {
    next(error);
  }
};