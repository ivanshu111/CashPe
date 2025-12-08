const User = require("../models/User");
const Transaction = require("../models/Transaction");

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
      .populate("sender", "name email") // Populate sender with name and email
      .populate("receiver", "name email"); // Populate receiver with name and email
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT /api/admin/user/:userId/freeze
// @desc    Freeze user account
// @access  Admin
exports.freezeUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.status = "frozen"; // Assuming 'frozen' is a valid status
    await user.save();

    res.json({ msg: `User ${user.email} account has been frozen.` });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   PUT /api/admin/user/:userId/unfreeze
// @desc    Unfreeze user account
// @access  Admin
exports.unfreezeUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.status = "active"; // Assuming 'active' is the default unblocked status
    await user.save();

    res.json({ msg: `User ${user.email} account has been unfrozen.` });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
};
