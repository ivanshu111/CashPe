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

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     description: Get the balance of the currently authenticated user's wallet.
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/balance", auth, verifyPin, getBalance);

/**
 * @swagger
 * /api/wallet/details:
 *   get:
 *     summary: Get wallet details
 *     description: Get the details of the currently authenticated user's wallet.
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet details retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/details", auth, getWalletDetails);

/**
 * @swagger
 * /api/wallet/add-money:
 *   post:
 *     summary: Add money to wallet
 *     description: Add money to the currently authenticated user's wallet.
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Money added successfully
 *       400:
 *         description: Bad request
 */
router.post("/add-money", auth, addMoney);

/**
 * @swagger
 * /api/wallet/send-money:
 *   post:
 *     summary: Send money to another user
 *     description: Send money from the currently authenticated user's wallet to another user's wallet.
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 example: "60f7e1bfa9b7a2a3e4b5c6d7"
 *               amount:
 *                 type: number
 *                 example: 50
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Money sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/send-money", auth, verifyPin, sendMoney); // Add sendMoney route

module.exports = router;
