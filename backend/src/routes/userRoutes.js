const express = require("express");
const router = express.Router();
const { findUsers, deleteUserAccount } = require("../controllers/userController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const userController = require("../controllers/userController");

/**
 * @swagger
 * /api/users/find:
 *   get:
 *     summary: Find users
 *     description: Find users by name or email.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The search query (name or email)
 *     responses:
 *       200:
 *         description: A list of users
 *       401:
 *         description: Unauthorized
 */
router.get("/find", auth, findUsers);

/**
 * @swagger
 * /api/users/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     description: Upload a profile picture for the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/profile-picture",
  auth,
  upload.single("profilePicture"),
  userController.uploadProfilePicture
);

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Delete user account
 *     description: Delete the account of the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/", auth, deleteUserAccount);

module.exports = router;
