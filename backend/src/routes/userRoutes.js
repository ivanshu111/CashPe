const express = require("express");
const router = express.Router();
const { findUsers } = require("../controllers/userController");
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

module.exports = router;
