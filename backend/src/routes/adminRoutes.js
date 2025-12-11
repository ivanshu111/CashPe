const express = require("express");
const router = express.Router();
const { getAllUsers, getAllTransactions, updateUserStatus } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

// Admin Routes
router.get("/users", adminAuth, getAllUsers);
router.get("/transactions", adminAuth, getAllTransactions);

// Route to update a user's status (e.g., freeze/unfreeze)
router.put(
  "/users/:userId/status",
  adminAuth,
  updateUserStatus
);

module.exports = router;
