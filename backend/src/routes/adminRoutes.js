const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth"); // Assuming auth middleware exists
const adminAuth = require("../middlewares/adminAuth"); // Custom middleware for admin role check

// Protect all admin routes with authentication and admin role check
router.use(auth);
router.use(adminAuth);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Accessible only by admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden, only admins can access.
 */
router.get("/users", adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieve a list of all transactions. Accessible only by admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all transactions.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden, only admins can access.
 */
router.get("/transactions", adminController.getAllTransactions);

/**
 * @swagger
 * /api/admin/users/{userId}/status:
 *   put:
 *     summary: Update user status
 *     description: Update a specific user's status to active or inactive. Accessible only by admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *       - in: body
 *         name: status
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [active, inactive]
 *         description: The new status for the user.
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *       400:
 *         description: Invalid status provided.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden, only admins can access.
 *       404:
 *         description: User not found.
 */
router.put("/users/:userId/status", adminController.updateUserStatus);

/**
 * @swagger
 * /api/admin/users/{userId}/details:
 *   get:
 *     summary: Get user details
 *     description: Get a consolidated, detailed view of a single user. Accessible only by admin.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve details for.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden, only admins can access.
 *       404:
 *         description: User not found.
 */
router.get("/users/:userId/details", adminController.getUserDetails);

module.exports = router;