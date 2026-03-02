const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = jwt.sign(
    { id: user._id, isSuperAdmin: user.isSuperAdmin },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({ success: true, accessToken });
};

// @desc    Login user (accepts email or username)
// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
      .select("+password")
      .populate("role", "name permissions");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get current user profile with role + permissions
// @route   GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("role", "name description permissions");

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get new access token from refresh token
// @route   GET /api/auth/refresh
router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Not authorized, no refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(
      { id: user._id, isSuperAdmin: user.isSuperAdmin },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN },
    );

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

// @desc    Logout - clear refresh token cookie
// @route   POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  res.status(200).json({ success: true, message: "Logged out" });
});

module.exports = router;
