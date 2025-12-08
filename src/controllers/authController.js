const { validationResult } = require("express-validator");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const Wallet = require("../models/Wallet");

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, pin } = req.body;
    if (!name || !email || !password || !phone || !pin) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      pin,
    });

    //create wallet for user
    await Wallet.create({
      user: newUser._id,
      balance: 0,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = generateToken({ userId: user._id });
    res.status(200).json({ token, message: "User logged in successfully" });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, password, phone, pin } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }
    if (phone) {
      user.phone = phone;
    }
    if (password) {
      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
    }
    if (pin) {
      user.pin = pin;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

const Transaction = require("../models/Transaction");

const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("fromUser", "name email")
      .populate("toUser", "name email");

    res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getTransactionHistory,
};
