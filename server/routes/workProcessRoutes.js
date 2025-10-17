const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");
const WorkProcessStep = require("../models/WorkProcessStep");

// --- PUBLIC ROUTE ---
// @desc    Get all work process steps
// @route   GET /api/work-process
// @access  Public
router.get("/", async (req, res) => {
  try {
    const steps = await WorkProcessStep.find().sort({ displayOrder: "asc" });
    res.json({ success: true, data: steps });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- ADMIN ROUTES ---

// @desc    Create a new work process step
// @route   POST /api/work-process
// @access  Private (Admin)
router.post(
  "/",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image." });
      }
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "work-process",
      });

      const newStep = await WorkProcessStep.create({
        ...req.body,
        image: result.secure_url,
      });
      res.status(201).json({ success: true, data: newStep });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

// @desc    Update a work process step
// @route   PUT /api/work-process/:id
// @access  Private (Admin)
router.put(
  "/:id",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      let updateData = { ...req.body };

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "work-process",
        });
        updateData.image = result.secure_url;
      }

      const updatedStep = await WorkProcessStep.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
      );
      if (!updatedStep) {
        return res.status(404).json({ message: "Step not found" });
      }
      res.json({ success: true, data: updatedStep });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

// @desc    Delete a work process step
// @route   DELETE /api/work-process/:id
// @access  Private (Admin)
router.delete("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const step = await WorkProcessStep.findById(req.params.id);
    if (!step) {
      return res.status(404).json({ message: "Step not found" });
    }
    await step.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
