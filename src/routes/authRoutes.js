const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
console.log("Auth Routes loaded.");
const {
  registerUser,
  loginUser,
  updateUserProfile,
} = require("../controllers/authController");
const auth = require("../middlewares/auth");

router.patch("/profile", auth, updateUserProfile);

router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  registerUser
);
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

router.get("/history", auth, getTransactionHistory);

module.exports = router;
