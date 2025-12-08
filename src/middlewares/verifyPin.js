const User = require("../models/User");
const { comparePassword } = require("../utils/hash");

const verifyPin = async (req, res, next) => {
  const pin = req.body.pin || req.query.pin; // Check both body and query for PIN
  const userId = req.user.id;

  if (!pin) {
    return res.status(400).json({ message: "PIN is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(pin, user.pin);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid PIN" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = verifyPin;
