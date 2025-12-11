const express = require("express");
const router = express.Router();
const { getAllUsers, getAllTransactions, updateUserStatus, getDetailedUserView } = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Get a paginated list of all users.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of users to retrieve per page.
 *     responses:
 *       200:
 *         description: A paginated list of users
 *       401:
 *         description: Unauthorized
 */
router.get("/users", adminAuth, getAllUsers);

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Get a paginated list of all transactions.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of transactions to retrieve per page.
 *     responses:
 *       200:
 *         description: A paginated list of transactions
 *       401:
 *         description: Unauthorized
 */
router.get("/transactions", adminAuth, getAllTransactions);

/**
 * @swagger
 * /api/admin/users/{userId}/status:
 *   put:
 *     summary: Update user status
 *     description: Update the status of a user (e.g., freeze/unfreeze).
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isFrozen:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put(
  "/users/:userId/status",
  adminAuth,
  updateUserStatus
);

/**
 * @swagger
 * /api/admin/users/{userId}/details:
 *   get:
 *     summary: Get detailed user view
 *     description: Get a detailed view of a single user, including a paginated list of their transactions.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for the transaction list.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of transactions to retrieve per page.
 *     responses:
 *       200:
 *         description: Detailed user view retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/users/:userId/details", adminAuth, getDetailedUserView);

module.exports = router;
