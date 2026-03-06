const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const { protect, checkPermission } = require("../middleware/authMiddleware");

// ============================================
// EMPLOYEE ROUTES
// ============================================

// GET /api/attendance/my
// Employee views their own attendance history (last 30 days)
router.get("/my", protect, async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/attendance/my/today
// Returns today's record if it exists (used to show correct button state)
router.get("/my/today", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const record = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });
    res.json({ success: true, data: record || null });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/attendance/checkin
// Employee punches in
router.post("/checkin", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Block if already punched in today
    const existing = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already checked in today." });
    }

    const record = await Attendance.create({
      user: req.user._id,
      date: today,
      checkIn: new Date(),
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// POST /api/attendance/checkout
// Employee punches out — only allowed after 5 hours from check-in
router.post("/checkout", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (!record) {
      return res.status(400).json({ message: "You haven't checked in today." });
    }

    if (record.checkOut) {
      return res
        .status(400)
        .json({ message: "You have already checked out today." });
    }

    const now = new Date();
    const checkInTime = new Date(record.checkIn);
    const diffMs = now - checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);

    // Enforce 5-hour minimum before checkout
    if (diffHours < 5) {
      const remainingMins = Math.ceil(5 * 60 - diffMs / (1000 * 60));
      return res.status(400).json({
        message: `Check-out not allowed yet. Please wait ${remainingMins} more minute(s).`,
      });
    }

    record.checkOut = now;
    record.totalHours = parseFloat(diffHours.toFixed(2));
    await record.save();

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// GET /api/attendance/all
// Admin sees all employees' attendance, with optional filters
router.get(
  "/all",
  protect,
  checkPermission("attendance", "view"),
  async (req, res) => {
    try {
      const { date, userId } = req.query;
      const filter = {};
      if (date) filter.date = date;
      if (userId) filter.user = userId;

      const records = await Attendance.find(filter)
        .populate("user", "username email")
        .sort({ date: -1, checkIn: -1 });

      res.json({ success: true, data: records });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

module.exports = router;
