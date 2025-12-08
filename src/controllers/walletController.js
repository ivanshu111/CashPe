const Wallet = require("../models/Wallet");

exports.getBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    next(error);
  }
};

exports.getWalletDetails = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id }).populate(
      "user",
      "name"
    );
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json({
      name: wallet.user.name,
      balance: wallet.balance,
      walletCreatedAt: wallet.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

exports.addMoney = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (req.user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "Your account is inactive. You cannot add money." });
    }

    wallet.balance += req.body.amount;
    await wallet.save();
    res
      .status(200)
      .json(
        { balance: wallet.balance },
        { message: "Money added successfully" }
      );
  } catch (error) {
    next(error);
  }
};
