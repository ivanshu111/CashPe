const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  getLoggedInUserNotifications, // Import the new function
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/auth");

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     description: Create a new notification for a user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, createNotification);

/**
 * @swagger
 * /api/notifications/{userId}:
 *   get:
 *     summary: Get user notifications
 *     description: Get paginated notification history for a specific user ID.
 *     tags: [Notifications]
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
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of notifications to retrieve per page.
 *     responses:
 *       200:
 *         description: A paginated list of notifications
 *       401:
 *         description: Unauthorized
 */
router.get("/:userId", authMiddleware, getUserNotifications);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get logged-in user notifications
 *     description: Get paginated notification history for the currently logged-in user.
 *     tags: [Notifications]
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
 *         description: The number of notifications to retrieve per page.
 *     responses:
 *       200:
 *         description: A paginated list of notifications
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getLoggedInUserNotifications); // New route

module.exports = router;
