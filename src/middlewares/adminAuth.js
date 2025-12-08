const jwt = require("../utils/jwt");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Check if Authorization header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verifyToken(token);
    const user = await User.findById(decoded.userId);
    req.user = user; // Attach user object to request

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Access denied: Not an administrator" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = adminAuth;
