const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect, checkPermission } = require("../middleware/authMiddleware");

// ============================================
// EMPLOYEE ROUTES
// ============================================

// GET /api/tasks/my
// Employee sees all tasks assigned to them
router.get("/my", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("assignedBy", "username")
      .sort({ dueDate: 1, dueTime: 1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/tasks/:id/done
// Employee marks their own task as done — records completedAt timestamp
router.put("/:id/done", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only the assigned employee can mark it done
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (task.status === "done") {
      return res
        .status(400)
        .json({ message: "Task is already marked as done." });
    }

    task.status = "done";
    task.completedAt = new Date();
    await task.save();

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/tasks/:id/status
// Employee can update their task status (e.g. pending -> in-progress)
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = status;
    if (status === "done") task.completedAt = new Date();
    await task.save();

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

// GET /api/tasks/all
// Admin sees all tasks with optional filters
router.get(
  "/all",
  protect,
  checkPermission("tasks", "view"),
  async (req, res) => {
    try {
      const { userId, status } = req.query;
      const filter = {};
      if (userId) filter.assignedTo = userId;
      if (status) filter.status = status;

      const tasks = await Task.find(filter)
        .populate("assignedTo", "username email")
        .populate("assignedBy", "username")
        .sort({ dueDate: 1 });

      res.json({ success: true, data: tasks });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// POST /api/tasks
// Admin creates and assigns a task to an employee
router.post(
  "/",
  protect,
  checkPermission("tasks", "create"),
  async (req, res) => {
    try {
      const { title, description, assignedTo, dueDate, dueTime, priority } =
        req.body;

      if (!title || !assignedTo || !dueDate || !dueTime) {
        return res.status(400).json({
          message: "title, assignedTo, dueDate and dueTime are required.",
        });
      }

      const task = await Task.create({
        title,
        description,
        assignedTo,
        assignedBy: req.user._id,
        dueDate,
        dueTime,
        priority: priority || "medium",
      });

      const populated = await Task.findById(task._id)
        .populate("assignedTo", "username email")
        .populate("assignedBy", "username");

      res.status(201).json({ success: true, data: populated });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },
);

// PUT /api/tasks/:id
// Admin edits an existing task
router.put(
  "/:id",
  protect,
  checkPermission("tasks", "update"),
  async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate("assignedTo", "username email")
        .populate("assignedBy", "username");

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// DELETE /api/tasks/:id
// Admin deletes a task
router.delete(
  "/:id",
  protect,
  checkPermission("tasks", "delete"),
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await task.deleteOne();
      res.json({ success: true, data: {} });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  },
);

module.exports = router;
