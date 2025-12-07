const express = require("express");
const router = express.Router();
const {
  getBalance,
  getWalletDetails,
  addMoney,
} = require("../controllers/walletController");
const auth = require("../middlewares/auth");

router.get("/balance", auth, getBalance);
router.get("/details", auth, getWalletDetails);
router.post("/add-money", auth, addMoney);

module.exports = router;
