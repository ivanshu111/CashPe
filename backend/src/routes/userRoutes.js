const express = require("express");
const router = express.Router();
const { findUsers } = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.get("/find", auth, findUsers);

module.exports = router;