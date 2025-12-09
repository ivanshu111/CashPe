const User = require("../models/User");

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

module.exports = {
  findUsers,
  uploadProfilePicture,
};
