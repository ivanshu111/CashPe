const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

// Admin Routes
router.get("/users", adminAuth, adminController.getAllUsers);
router.get("/transactions", adminAuth, adminController.getAllTransactions);
router.put(
  "/user/:userId/freeze",
  adminAuth,
  adminController.freezeUserAccount
);
router.put(
  "/user/:userId/unfreeze",
  adminAuth,
  adminController.unfreezeUserAccount
);

module.exports = router;
