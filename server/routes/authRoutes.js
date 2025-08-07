// server/routes/authRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Utility to generate tokens and set cookies
const sendTokenResponse = (user, statusCode, res) => {
  // Create access token
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    },
  );

  // Create refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  );

  // Set refresh token in a secure, httpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // ❗ Must be false for localhost (otherwise browser blocks it)
    sameSite: "Lax", // ❗ 'Strict' blocks cross-origin refresh; use 'Lax' for local dev
    path: "/api/auth/refresh", // Optional: restrict to just refresh route
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    success: true,
    accessToken,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // For the first user, we can assign the 'client' role directly
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? "client" : "user";

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    sendTokenResponse(user, 200, res);
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

    // Issue a new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      },
    );

    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
