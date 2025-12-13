const adminAuth = (req, res, next) => {
  // Assuming req.user is populated by a previous authentication middleware
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
  next();
};

module.exports = adminAuth;