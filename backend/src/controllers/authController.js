const { validationResult } = require("express-validator");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const Wallet = require("../models/Wallet");
const fs = require('fs'); // Import file system module
const path = require('path'); // Import path module

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, and a file was uploaded, delete it
    if (req.file) {
      // In a real application, you might want to log this or handle it more gracefully
      // For now, we'll just delete the file.
      
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, pin } = req.body;
    
    // Check for required fields, excluding profilePicture as it's optional
    if (!name || !email || !password || !phone || !pin) {
      // If a file was uploaded but other required fields are missing, delete it
      if (req.file) {
        
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
      return res.status(400).json({ message: "All required fields (name, email, password, phone, pin) are necessary" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If a file was uploaded but email already exists, delete it
      if (req.file) {
        
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
      return res.status(400).json({ message: "Email already exists" });
    }
    
    let profilePicturePath = req.file ? `/uploads/profile-pictures/${req.file.filename}` : undefined;

    const newUser = await User.create({
      name,
      email,
      password, // Pass plain text password
      phone,
      pin,
      profilePicture: profilePicturePath,
    });

    //create wallet for user
    await Wallet.create({
      user: newUser._id,
      balance: 0,
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    // If an error occurs after file upload, delete the uploaded file
    if (req.file) {
      
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file during error handling:', err);
      });
    }
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
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = generateToken({ userId: user._id });
    // Select specific fields to return from the user object
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profilePicture: user.profilePicture,
    };
    res.status(200).json({ token, user: userResponse });
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
      // If user not found and a file was uploaded, delete it
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }
    if (phone) {
      user.phone = phone;
    }
    if (password) {
      user.password = await hashPassword(password);
    }
    if (pin) {
      user.pin = await hashPassword(pin);
    }

    // Handle profile picture update
    if (req.file) {
      // Delete old profile picture if it's not the default one
      const defaultProfilePicture = "https://www.cielhr.com/wp-content/uploads/2020/10/dummy-image.jpg";
      if (user.profilePicture && user.profilePicture !== defaultProfilePicture) {
        const oldProfilePicturePath = path.join(__dirname, '..', 'public', user.profilePicture.replace('/public', ''));
        fs.unlink(oldProfilePicturePath, (err) => {
          if (err) console.error('Error deleting old profile picture:', err);
        });
      }
      user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    // If an error occurs after file upload, delete the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file during error handling:', err);
      });
    }
    next(error);
  }
};

const Transaction = require("../models/Transaction");

const getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({
      $or: [
        { fromUser: userId, type: "debit" }, // Show debit if current user is sender
        { toUser: userId, type: "credit" }, // Show credit if current user is receiver
      ],
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
