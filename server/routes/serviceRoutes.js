// server/routes/serviceRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");

// Import Models
const Service = require("../models/Service");
const ServicePageContent = require("../models/ServicePageContent");

// --- PUBLIC ROUTES (for displaying on the website) ---

// @desc    Get all service cards
// @route   GET /api/services/cards
// @access  Public
router.get("/cards", async (req, res) => {
  try {
    const services = await Service.find().sort({ displayOrder: "asc" });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Get service page content
// @route   GET /api/services/content
// @access  Public
router.get("/content", async (req, res) => {
  try {
    const content = await ServicePageContent.findOne();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- ADMIN/PROTECTED ROUTES (for the dashboard) ---

// @desc    Update service page content
// @route   PUT /api/services/content
// @access  Private (Client)
router.put("/content", protect, authorize("client"), async (req, res) => {
  try {
    const content = await ServicePageContent.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // Creates the document if it doesn't exist
    });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Create a new service card
// @route   POST /api/services/cards
// @access  Private (Client)
router.post(
  "/cards",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await require("../config/cloudinary").uploader.upload(
        dataURI,
        {
          folder: "services",
        },
      );

      const newService = await Service.create({
        ...req.body,
        image: result.secure_url,
      });
      res.status(201).json({ success: true, data: newService });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

// @desc    Update a service card
// @route   PUT /api/services/cards/:id
// @access  Private (Client)
router.put(
  "/cards/:id",
  protect,
  authorize("client"),
  upload.single("image"),
  async (req, res) => {
    try {
      let updateData = { ...req.body };

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await require("../config/cloudinary").uploader.upload(
          dataURI,
          {
            folder: "services",
          },
        );
        updateData.image = result.secure_url;
      }

      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true },
      );
      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json({ success: true, data: updatedService });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
);

// @desc    Delete a service card
// @route   DELETE /api/services/cards/:id
// @access  Private (Client)
router.delete("/cards/:id", protect, authorize("client"), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    await service.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
