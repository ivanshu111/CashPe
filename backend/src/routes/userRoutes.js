const express = require("express");
const router = express.Router();
const { findUsers, deleteUserAccount } = require("../controllers/userController");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const userController = require("../controllers/userController");

router.get("/find", auth, findUsers);

router.post(
  "/profile-picture",
  auth,
  upload.single("profilePicture"),
  userController.uploadProfilePicture
);

// Route for a logged-in user to delete their own account
router.delete("/", auth, deleteUserAccount);

module.exports = router;
