const PDFDocument = require("pdfkit");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password -pin"); // Exclude sensitive info
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Admin
exports.getAllTransactions = async (req, res, next) => {
  try {
    const { sort_by, sort_order } = req.query;
    console.log("getAllTransactions - Received sort_by:", sort_by, "sort_order:", sort_order);
    let sortCriteria = { createdAt: -1 }; // Default sort

    if (sort_by && (sort_by === "amount" || sort_by === "createdAt")) { // Only allow sorting by amount or createdAt
      sortCriteria = { [sort_by]: sort_order === "asc" ? 1 : -1 };
    }
    console.log("getAllTransactions - Constructed sortCriteria:", sortCriteria);

    const transactions = await Transaction.find({})
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort(sortCriteria); // Apply dynamic sortCriteria
    res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (active/inactive)
// @route   PUT /api/admin/users/:userId/status
// @access  Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'active' or 'inactive'

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "User status updated successfully.", user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get consolidated, detailed view of a single user
// @route   GET /api/admin/users/:userId/details
// @access  Admin
exports.getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -pin");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const wallet = await Wallet.findOne({ user: userId });
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ user: { ...user.toObject(), wallet, transactions } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions for a specific user
// @route   GET /api/admin/users/:userId/transactions
// @access  Admin
exports.getUserTransactions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { sort_by, sort_order } = req.query; // Get sort parameters
    console.log("getUserTransactions - Received sort_by:", sort_by, "sort_order:", sort_order);

    let sortCriteria = { createdAt: -1 }; // Default sort

    if (sort_by && (sort_by === "amount" || sort_by === "createdAt")) { // Only allow sorting by amount or createdAt
      sortCriteria = { [sort_by]: sort_order === "asc" ? 1 : -1 };
    }
    console.log("getUserTransactions - Constructed sortCriteria:", sortCriteria);

    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort(sortCriteria); // Apply dynamic sortCriteria

    res.status(200).json({ transactions });
  } catch (error) {
    next(error);
  }
};

// @desc    Download a PDF report of all transactions
// @route   GET /api/admin/transactions/download
// @access  Private/Admin
exports.downloadTransactionsReport = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({})
      .populate("fromUser", "name email")
      .populate("toUser", "name email")
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions-report.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Transaction Report", { align: "center" }).moveDown();

    // Report Details
    doc.fontSize(10)
       .text(`Report Generated: ${new Date().toLocaleDateString()}`, { align: "right" })
       .text(`Total Transactions: ${transactions.length}`)
       .moveDown(2);

    // Table Header
    const tableTop = doc.y;
    const itemX = 30;
    const dateX = itemX;
    const fromX = 130;
    const toX = 260;
    const amountX = 390;
    const statusX = 470;

    doc.fontSize(10).font('Helvetica-Bold')
       .text("Date", dateX, tableTop)
       .text("From", fromX, tableTop)
       .text("To", toX, tableTop)
       .text("Amount", amountX, tableTop, { width: 80, align: 'right' })
       .text("Status", statusX, tableTop)
       .font('Helvetica');

    const drawLine = (y) => doc.moveTo(itemX, y).lineTo(570, y).stroke();
    drawLine(tableTop + 15);

    // Table Rows
    let yPos = tableTop + 25;
    transactions.forEach(tx => {
      if (yPos > 700) {
        doc.addPage();
        yPos = 30;
      }
      doc.fontSize(8)
         .text(new Date(tx.createdAt).toLocaleDateString(), dateX, yPos)
         .text(tx.fromUser ? tx.fromUser.name : "N/A", fromX, yPos, { width: 120, ellipsis: true })
         .text(tx.toUser ? tx.toUser.name : "N/A", toX, yPos, { width: 120, ellipsis: true })
         .text(`₹${tx.amount.toFixed(2)}`, amountX, yPos, { width: 80, align: 'right' })
         .text(tx.status, statusX, yPos);
      yPos += 20;
    });

    doc.end();

  } catch (error) {
    console.error("Error generating PDF report:", error);
    next(error);
  }
};