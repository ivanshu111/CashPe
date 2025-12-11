const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { publishNotification } = require("../service/redisManager");

// Define the maximum amount allowed to send in a single transaction (1 Lakh Rs)
const MAX_SEND_AMOUNT = 100000;

exports.sendMoney = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let debitTransaction;
  let creditTransaction;

  try {
    const { toUser: toUserId, amount } = req.body;

    // Validate input
    if (!toUserId || !amount || amount <= 0) {
      return res.status(400).json({
        message:
          "Invalid input. Recipient, amount (greater than 0) are required.",
      });
    }
    if (req.user.id === toUserId) {
      return res
        .status(400)
        .json({ message: "Cannot send money to yourself." });
    }

    // --- Enforce the send money limit ---
    if (amount > MAX_SEND_AMOUNT) {
      return res.status(400).json({
        message: `You cannot send more than Rs. ${MAX_SEND_AMOUNT} in a single transaction.`,
      });
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
        message:
          "Recipient account is inactive. You cannot send money to this user.",
      });
    }

    const fromWallet = await Wallet.findOne({ user: req.user.id }).session(
      session
    );
    if (!fromWallet) {
      throw new Error("Sender wallet not found");
    }
    // Fix: Ensure insufficient balance correctly throws an error and aborts transaction
    if (fromWallet.balance < amount) {
      await session.abortTransaction(); // Abort the transaction
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" }); // Return the error
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

    // --- Create and Publish Notifications ---
    try {
      // 1. Notification for the Sender
      const senderMessage = `You have sent Rs. ${amount} to ${recipientUser.name} successfully.`;
      const senderNotification = new Notification({
        userId: req.user.id, // The sender
        message: senderMessage,
      });
      await senderNotification.save();
      publishNotification(senderNotification.toObject());

      // 2. Notification for the Receiver
      const receiverMessage = `You have received Rs. ${amount} from ${req.user.name}.`;
      const receiverNotification = new Notification({
        userId: toUserId, // The receiver
        message: receiverMessage,
      });
      await receiverNotification.save();
      publishNotification(receiverNotification.toObject());
    } catch (notificationError) {
      console.error("Error creating and publishing notifications:", notificationError);
    }
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
