const User = require("../models/User");
const Wallet = require("../models/Wallet"); // Import Wallet model

const findUsers = async (req, res, next) => {
  try {
    const { email, phone } = req.query;
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Please provide an email or phone number to search" });
    }

    let query = {};
    if (email) {
      query.email = email;
    }
    if (phone) {
      query.phone = phone;
    }

    const users = await User.find(query).select("-password -pin"); // Exclude sensitive info

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id; // Get user ID from authenticated request
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the path to the database
    user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Find the user's wallet
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      // This case is unlikely if wallets are created on registration, but good to have
      return res.status(404).json({ message: "Wallet not found for this user." });
    }

    // 2. Check if the balance is greater than 0
    if (wallet.balance > 0) {
      return res.status(400).json({
        message: `Cannot delete account. You have Rs. ${wallet.balance} remaining in your wallet. Please transfer the amount to another account.`,
      });
    }

    // 3. If balance is 0, proceed with deletion
    await Wallet.findByIdAndDelete(wallet._id); // Delete the wallet
    await User.findByIdAndDelete(userId);     // Delete the user

    res.status(200).json({ message: "Your account and wallet have been successfully deleted." });

  } catch (error) {
    console.error("Error during account deletion:", error);
    next(error);
  }
};

module.exports = {
  findUsers,
  uploadProfilePicture,
  deleteUserAccount, // Export the new function
};
