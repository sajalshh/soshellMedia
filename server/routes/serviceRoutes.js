// server/routes/serviceRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

// Import the updated model from Step 1
const Service = require("../models/Service"); // Ensure this is the file you updated
const ServicePageContent = require("../models/ServicePageContent");

// --- PUBLIC ROUTES (for displaying on the website) ---

// @desc    Get all service cards
// @route   GET /api/services/cards
// @access  Public
router.get("/cards", async (req, res) => {
  try {
    // We now use the 'Service' model which has all the fields
    const services = await Service.find().sort({ displayOrder: "asc" });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- NEW PUBLIC ROUTE ---
// @desc    Get a single service by its slug
// @route   GET /api/services/slug/:slug
// @access  Public
router.get("/cards/slug/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, data: service });
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

// Middleware to handle two separate file uploads
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "detailImage", maxCount: 1 },
]);

// @desc    Update service page content
// @route   PUT /api/services/content
// @access  Private (Client)
router.put("/content", protect, authorize("client"), async (req, res) => {
  try {
    const content = await ServicePageContent.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
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
  uploadFields, // UPDATED: Use the new middleware for two files
  async (req, res) => {
    try {
      // Check for both files
      if (!req.files || !req.files.image || !req.files.detailImage) {
        return res
          .status(400)
          .json({
            message: "Please upload both a card image and a detail image.",
          });
      }

      // Process and upload the main card image
      const imageFile = req.files.image[0];
      const imageB64 = Buffer.from(imageFile.buffer).toString("base64");
      const imageDataURI = "data:" + imageFile.mimetype + ";base64," + imageB64;
      const imageResult = await cloudinary.uploader.upload(imageDataURI, {
        folder: "services",
      });

      // Process and upload the detail page image
      const detailImageFile = req.files.detailImage[0];
      const detailImageB64 = Buffer.from(detailImageFile.buffer).toString(
        "base64",
      );
      const detailImageDataURI =
        "data:" + detailImageFile.mimetype + ";base64," + detailImageB64;
      const detailImageResult = await cloudinary.uploader.upload(
        detailImageDataURI,
        { folder: "services_details" },
      );

      const { detailPoints, ...otherBodyData } = req.body;

      const newService = await Service.create({
        ...otherBodyData,
        image: imageResult.secure_url,
        detailImage: detailImageResult.secure_url,
        // Split the detailPoints string from the form into an array
        detailPoints: detailPoints
          ? detailPoints.split("\n").filter((p) => p.trim() !== "")
          : [],
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
  uploadFields, // UPDATED: Use the new middleware for two files
  async (req, res) => {
    try {
      const { detailPoints, ...otherBodyData } = req.body;
      let updateData = {
        ...otherBodyData,
        detailPoints: detailPoints
          ? detailPoints.split("\n").filter((p) => p.trim() !== "")
          : [],
      };

      // Check if a new card image was uploaded
      if (req.files && req.files.image) {
        const imageFile = req.files.image[0];
        const imageB64 = Buffer.from(imageFile.buffer).toString("base64");
        const imageDataURI =
          "data:" + imageFile.mimetype + ";base64," + imageB64;
        const imageResult = await cloudinary.uploader.upload(imageDataURI, {
          folder: "services",
        });
        updateData.image = imageResult.secure_url;
      }

      // Check if a new detail image was uploaded
      if (req.files && req.files.detailImage) {
        const detailImageFile = req.files.detailImage[0];
        const detailImageB64 = Buffer.from(detailImageFile.buffer).toString(
          "base64",
        );
        const detailImageDataURI =
          "data:" + detailImageFile.mimetype + ";base64," + detailImageB64;
        const detailImageResult = await cloudinary.uploader.upload(
          detailImageDataURI,
          { folder: "services_details" },
        );
        updateData.detailImage = detailImageResult.secure_url;
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
    // Note: You might want to delete images from Cloudinary here as well
    await service.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
