const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User"); // Assuming User model is needed for toUser validation

exports.sendMoney = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let debitTransaction;
  let creditTransaction;

  try {
    const { toUser: toUserId, amount } = req.body;

    // Validate input
    if (!toUserId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input. Recipient, amount (greater than 0) are required." });
    }
    if (req.user.id === toUserId) {
      return res.status(400).json({ message: "Cannot send money to yourself." });
    }

    // Check if recipient user exists
    const recipientUser = await User.findById(toUserId).session(session);
    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient user not found." });
    }

    // Check if sender or receiver is inactive
    if (req.user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "Your account is inactive. You cannot send money." });
    }
    if (recipientUser.status === "inactive") {
      return res.status(403).json({
        message: "Recipient account is inactive. You cannot send money to this user.",
      });
    }

    const fromWallet = await Wallet.findOne({ user: req.user.id }).session(session);
    if (!fromWallet) {
      throw new Error("Sender wallet not found");
    }
    if (fromWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }
    const toWallet = await Wallet.findOne({ user: toUserId }).session(session);
    if (!toWallet) {
      throw new Error("Recipient wallet not found");
    }

    // Create pending transactions
    [debitTransaction, creditTransaction] = await Transaction.create(
      [
        {
          wallet: fromWallet._id,
          type: "debit",
          amount,
          fromUser: req.user.id,
          toUser: toUserId,
          status: "pending",
        },
        {
          wallet: toWallet._id,
          type: "credit",
          amount,
          fromUser: req.user.id,
          toUser: toUserId,
          status: "pending",
        },
      ],
      { session, ordered: true }
    );

    // Update wallet balances
    fromWallet.balance -= amount;
    toWallet.balance += amount;
    await fromWallet.save({ session });
    await toWallet.save({ session });

    // Update transaction statuses to completed
    debitTransaction.status = "completed";
    creditTransaction.status = "completed";
    await debitTransaction.save({ session });
    await creditTransaction.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "Money sent successfully" });
  } catch (error) {
    if (debitTransaction) {
      debitTransaction.status = "failed";
      await debitTransaction.save({ session });
    }
    if (creditTransaction) {
      creditTransaction.status = "failed";
      await creditTransaction.save({ session });
    }
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
