const express = require("express");
const router = express.Router();
const MediaProject = require("../models/MediaProject");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Helper: get role name from req.user
const getRoleName = (user) => {
  if (user.isSuperAdmin) return "Owner";
  return user.role?.name || "";
};

// Helper: check if user is allowed to access this project
const toId = (val) => val?._id?.toString() ?? val?.toString() ?? null;

const canAccessProject = (project, user) => {
  const roleName = getRoleName(user);
  if (roleName === "Owner") return true;
  const uid = user._id.toString();
  return (
    toId(project.clientId) === uid ||
    toId(project.assignedProduction) === uid ||
    toId(project.assignedEditor) === uid ||
    toId(project.assignedDesigner) === uid
  );
};

// @route   GET /api/media-projects
// @desc    List projects (Owner sees all; others see only theirs)
router.get("/", protect, async (req, res) => {
  try {
    const roleName = getRoleName(req.user);
    let query = {};

    if (roleName !== "Owner") {
      const uid = req.user._id;
      query = {
        $or: [
          { clientId: uid },
          { assignedProduction: uid },
          { assignedEditor: uid },
          { assignedDesigner: uid },
        ],
      };
    }

    const projects = await MediaProject.find(query)
      .populate("clientId", "username email")
      .populate("assignedProduction", "username email")
      .populate("assignedEditor", "username email")
      .populate("assignedDesigner", "username email")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/media-projects
// @desc    Create a project (Owner, Production)
router.post("/", protect, async (req, res) => {
  try {
    const roleName = getRoleName(req.user);
    if (!["Owner", "Production"].includes(roleName)) {
      return res
        .status(403)
        .json({ message: "Not authorized to create projects" });
    }

    const {
      title,
      description,
      clientId,
      assignedProduction,
      assignedEditor,
      assignedDesigner,
    } = req.body;

    const isProduction = roleName === "Production";

    const project = await MediaProject.create({
      title,
      description,
      clientId: clientId || null,
      assignedProduction:
        assignedProduction || (isProduction ? req.user._id : null),
      assignedEditor: assignedEditor || null,
      assignedDesigner: assignedDesigner || null,
      createdBy: req.user._id,
    });

    await project.populate([
      { path: "clientId", select: "username email" },
      { path: "assignedProduction", select: "username email" },
      { path: "assignedEditor", select: "username email" },
      { path: "assignedDesigner", select: "username email" },
      { path: "createdBy", select: "username" },
    ]);

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/media-projects/users/by-role
// @desc    Get users grouped by role (for assignment dropdowns)
// NOTE: This must be defined BEFORE /:id to avoid "users" being treated as an id
router.get("/users/by-role", protect, async (req, res) => {
  try {
    const roleName = getRoleName(req.user);
    if (!["Owner", "Production"].includes(roleName)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({ isActive: true })
      .select("username email role")
      .populate("role", "name");

    const grouped = {};
    for (const u of users) {
      const rn = u.role?.name || "Unknown";
      if (!grouped[rn]) grouped[rn] = [];
      grouped[rn].push({ _id: u._id, username: u.username, email: u.email });
    }

    res.json({ success: true, data: grouped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/media-projects/:id
// @desc    Get single project
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await MediaProject.findById(req.params.id)
      .populate("clientId", "username email")
      .populate("assignedProduction", "username email")
      .populate("assignedEditor", "username email")
      .populate("assignedDesigner", "username email")
      .populate("createdBy", "username")
      .populate("feedback.submittedBy", "username");

    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canAccessProject(project, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PATCH /api/media-projects/:id
// @desc    Update project fields (role-gated)
router.patch("/:id", protect, async (req, res) => {
  try {
    const project = await MediaProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!canAccessProject(project, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const roleName = getRoleName(req.user);

    if (roleName === "Owner") {
      const {
        title,
        description,
        clientId,
        assignedProduction,
        assignedEditor,
        assignedDesigner,
        rawFileLink,
        scriptLink,
        editedFileLink,
        finalLink,
        editorStatus,
        clientApproval,
        status,
        currentRound,
      } = req.body;

      if (title !== undefined) project.title = title;
      if (description !== undefined) project.description = description;
      if (clientId !== undefined) project.clientId = clientId || null;
      if (assignedProduction !== undefined)
        project.assignedProduction = assignedProduction || null;
      if (assignedEditor !== undefined)
        project.assignedEditor = assignedEditor || null;
      if (assignedDesigner !== undefined)
        project.assignedDesigner = assignedDesigner || null;
      if (rawFileLink !== undefined) project.rawFileLink = rawFileLink;
      if (scriptLink !== undefined) project.scriptLink = scriptLink;
      if (editedFileLink !== undefined) project.editedFileLink = editedFileLink;
      if (finalLink !== undefined) project.finalLink = finalLink;
      if (editorStatus !== undefined) project.editorStatus = editorStatus;
      if (clientApproval !== undefined) project.clientApproval = clientApproval;
      if (status !== undefined) project.status = status;
      if (currentRound !== undefined) project.currentRound = currentRound;
    } else if (roleName === "Production") {
      const {
        title,
        description,
        clientId,
        assignedProduction,
        assignedEditor,
        assignedDesigner,
        rawFileLink,
        scriptLink,
      } = req.body;

      if (title !== undefined) project.title = title;
      if (description !== undefined) project.description = description;
      if (clientId !== undefined) project.clientId = clientId || null;
      if (assignedProduction !== undefined)
        project.assignedProduction = assignedProduction || null;
      if (assignedEditor !== undefined)
        project.assignedEditor = assignedEditor || null;
      if (assignedDesigner !== undefined)
        project.assignedDesigner = assignedDesigner || null;
      if (rawFileLink !== undefined) project.rawFileLink = rawFileLink;
      if (scriptLink !== undefined) project.scriptLink = scriptLink;
    } else if (roleName === "Editor" || roleName === "Designer") {
      const { editedFileLink, finalLink, editorStatus } = req.body;

      if (editedFileLink !== undefined) project.editedFileLink = editedFileLink;
      if (editorStatus !== undefined) project.editorStatus = editorStatus;

      // If editor submits a new finalLink after client rejection,
      // bump the round and reset approval to pending for client to re-review.
      if (finalLink !== undefined) {
        const isRespondingToFeedback =
          finalLink &&
          finalLink !== project.finalLink &&
          project.clientApproval === "not_approved";

        project.finalLink = finalLink;

        if (isRespondingToFeedback) {
          project.currentRound += 1;
          project.clientApproval = "pending";
        }
      }
    } else if (roleName === "Client") {
      const { clientApproval } = req.body;
      if (clientApproval !== undefined) project.clientApproval = clientApproval;
    } else {
      return res
        .status(403)
        .json({ message: "Not authorized to update projects" });
    }

    await project.save();
    await project.populate([
      { path: "clientId", select: "username email" },
      { path: "assignedProduction", select: "username email" },
      { path: "assignedEditor", select: "username email" },
      { path: "assignedDesigner", select: "username email" },
      { path: "createdBy", select: "username" },
      { path: "feedback.submittedBy", select: "username" },
    ]);

    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/media-projects/:id/feedback
// @desc    Submit feedback (Client only)
router.post("/:id/feedback", protect, async (req, res) => {
  try {
    const roleName = getRoleName(req.user);
    if (roleName !== "Client") {
      return res
        .status(403)
        .json({ message: "Only clients can submit feedback" });
    }

    const project = await MediaProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.clientId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: "Feedback message is required" });
    }

    project.feedback.push({
      message: message.trim(),
      round: project.currentRound,
      submittedBy: req.user._id,
    });

    project.clientApproval = "not_approved";

    await project.save();
    await project.populate("feedback.submittedBy", "username");

    res.json({ success: true, data: project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/media-projects/:id
// @desc    Delete project (Owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    if (getRoleName(req.user) !== "Owner") {
      return res
        .status(403)
        .json({ message: "Only Owner can delete projects" });
    }

    const project = await MediaProject.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
