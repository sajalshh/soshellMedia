const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const Role = require("../models/Role");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

// All routes require auth + admin
router.use(protect, requireAdmin);

// @desc    List all users
// @route   GET /api/admin/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Create a user
// @route   POST /api/admin/users
router.post("/", async (req, res) => {
  try {
    const { username, email, password, roleId } = req.body;

    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const role = await Role.findById(roleId);
    if (!role) return res.status(400).json({ message: "Invalid role" });

    // Non-SuperAdmin cannot assign SuperAdmin role
    if (role.name === "SuperAdmin" && !req.user.isSuperAdmin) {
      return res
        .status(403)
        .json({ message: "Cannot assign SuperAdmin role" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: roleId,
      isSuperAdmin: false,
    });

    const populatedUser = await User.findById(user._id)
      .select("-password")
      .populate("role", "name");

    res.status(201).json({ success: true, data: populatedUser });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update a user
// @route   PUT /api/admin/users/:id
router.put("/:id", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser)
      return res.status(404).json({ message: "User not found" });

    // Protect SuperAdmin from non-SuperAdmin modification
    if (targetUser.isSuperAdmin && !req.user.isSuperAdmin) {
      return res.status(403).json({ message: "Cannot modify SuperAdmin" });
    }

    const { username, email, password, roleId, isActive } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(400).json({ message: "Invalid role" });
      if (role.name === "SuperAdmin" && !req.user.isSuperAdmin) {
        return res
          .status(403)
          .json({ message: "Cannot assign SuperAdmin role" });
      }
      updateData.role = roleId;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    )
      .select("-password")
      .populate("role", "name");

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser)
      return res.status(404).json({ message: "User not found" });

    if (targetUser.isSuperAdmin) {
      return res.status(403).json({ message: "Cannot delete SuperAdmin" });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    await targetUser.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
