const express = require("express");
const router = express.Router();
const {
  getBalance,
  getWalletDetails,
  addMoney,
} = require("../controllers/walletController");
const { sendMoney } = require("../controllers/transactionController"); // Import sendMoney
const auth = require("../middlewares/auth");
const verifyPin = require("../middlewares/verifyPin"); // Import verifyPin middleware

router.get("/balance", auth, verifyPin, getBalance);
router.get("/details", auth, verifyPin, getWalletDetails);
router.post("/add-money", auth, verifyPin, addMoney);
router.post("/send-money", auth, verifyPin, sendMoney); // Add sendMoney route

module.exports = router;
