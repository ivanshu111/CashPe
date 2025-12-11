const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification"); // Import Notification model
const { publishNotification } = require("../service/redisManager"); // Import notification service

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

    const amountToAdd = req.body.amount;
    if (!amountToAdd || amountToAdd <= 0) {
      return res
        .status(400)
        .json({ message: "Amount to add must be a positive number." });
    }

    wallet.balance += amountToAdd;
    await wallet.save();
    res
      .status(200)
      .json({ balance: wallet.balance, message: "Money added successfully" });

    // --- Create and Publish Notification ---
    try {
      const notificationMessage = `You added Rs. ${amountToAdd}. to your wallet. New balance: Rs. ${wallet.balance}.`;

      const notification = new Notification({
        userId: req.user.id,
        message: notificationMessage,
      });
      await notification.save();
      publishNotification(notification.toObject());
    } catch (notificationError) {
      console.error(
        "Error creating notification for add money:",
        notificationError
      );
    }
  } catch (error) {
    next(error);
  }
};
