const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes - populates role with permissions
exports.protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      req.user = await User.findById(decoded.id)
        .select("-password")
        .populate("role", "name permissions");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Granular permission check: checkPermission("blog", "create")
exports.checkPermission = (feature, action) => {
  return (req, res, next) => {
    // SuperAdmin always passes
    if (req.user.isSuperAdmin) {
      return next();
    }

    const userPermissions = req.user.role?.permissions || [];
    const featurePerm = userPermissions.find((p) => p.feature === feature);

    if (!featurePerm || !featurePerm.actions.includes(action)) {
      return res.status(403).json({
        message: `You do not have permission to ${action} ${feature}`,
      });
    }

    next();
  };
};

// Require Admin-level access (for user/role management)
exports.requireAdmin = (req, res, next) => {
  if (req.user.isSuperAdmin) {
    return next();
  }

  const roleName = req.user.role?.name;
  if (roleName === "Admin") {
    return next();
  }

  return res.status(403).json({
    message: "Admin access required",
  });
};

// Legacy compatibility - kept for gradual migration
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user.isSuperAdmin) {
      return next();
    }
    const roleName = req.user.role?.name?.toLowerCase();
    if (!roleName || !roles.includes(roleName)) {
      return res.status(403).json({
        message: `User role '${roleName || "none"}' is not authorized to access this route`,
      });
    }
    next();
  };
};
