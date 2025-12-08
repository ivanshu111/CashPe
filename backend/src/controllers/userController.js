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

module.exports = {
  findUsers,
};