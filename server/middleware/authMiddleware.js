// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  console.log("📥 Incoming Authorization:", authHeader);

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      console.log("✅ Token decoded:", decoded);

      // Get user from the token payload (we added the user's id to the payload)
      req.user = await User.findById(decoded.id).select("-password");
      console.log("👤 User from DB:", req.user);

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.log(
        `⛔ Unauthorized access attempt. Required roles: [${roles.join(
          ", ",
        )}], but user has role: ${req.user?.role}`,
      );
      return res
        .status(403)
        .json({
          message: `User role '${
            req.user ? req.user.role : "none"
          }' is not authorized to access this route`,
        });
    }
    next();
  };
};
