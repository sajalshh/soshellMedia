const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const User = require("../models/User");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

router.use(protect, requireAdmin);

// @desc    List all roles
// @route   GET /api/admin/roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find().sort({ isSystem: -1, name: 1 });
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get available features and actions
// @route   GET /api/admin/roles/features
router.get("/features", async (req, res) => {
  res.json({
    success: true,
    data: {
      features: Role.FEATURES,
      actions: Role.ACTIONS,
    },
  });
});

// @desc    Create a custom role
// @route   POST /api/admin/roles
router.post("/", async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const role = await Role.create({
      name,
      description: description || "",
      permissions: permissions || [],
      isSystem: false,
    });

    res.status(201).json({ success: true, data: role });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Role name already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update a role
// @route   PUT /api/admin/roles/:id
router.put("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Cannot rename system roles
    if (role.isSystem && req.body.name && req.body.name !== role.name) {
      return res.status(400).json({ message: "Cannot rename system roles" });
    }

    // Non-SuperAdmin cannot modify SuperAdmin role
    if (role.name === "SuperAdmin" && !req.user.isSuperAdmin) {
      return res
        .status(403)
        .json({ message: "Cannot modify SuperAdmin role" });
    }

    const { name, description, permissions } = req.body;
    if (name && !role.isSystem) role.name = name;
    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = permissions;

    await role.save();
    res.json({ success: true, data: role });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Role name already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete a custom role
// @route   DELETE /api/admin/roles/:id
router.delete("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (role.isSystem) {
      return res.status(400).json({ message: "Cannot delete system roles" });
    }

    const usersWithRole = await User.countDocuments({ role: req.params.id });
    if (usersWithRole > 0) {
      return res.status(400).json({
        message: `Cannot delete role, ${usersWithRole} user(s) are assigned to it`,
      });
    }

    await role.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
