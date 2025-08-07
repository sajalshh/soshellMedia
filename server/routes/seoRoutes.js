// server/routes/seoRoutes.js

const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const SeoData = require("../models/SeoData");

// @desc    Get SEO data for a specific page URL
// @route   GET /api/seo?pageUrl=/about
// @access  Public
router.get("/", async (req, res) => {
  try {
    const pageUrl = req.query.pageUrl;
    if (!pageUrl) {
      return res
        .status(400)
        .json({ message: "pageUrl query parameter is required" });
    }
    const seoData = await SeoData.findOne({ pageUrl });
    if (!seoData) {
      // Return default data or an empty object if no specific data is found
      return res
        .status(404)
        .json({ message: "No SEO data found for this URL" });
    }
    res.status(200).json({ success: true, data: seoData });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Get all SEO data entries (for the dashboard)
// @route   GET /api/seo/all
// @access  Private (Client)
router.get("/all", protect, authorize("client"), async (req, res) => {
  try {
    const allSeoData = await SeoData.find();
    res.status(200).json({ success: true, data: allSeoData });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update SEO data by its ID
// @route   PUT /api/seo/:id
// @access  Private (Client)
router.put("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const updatedSeoData = await SeoData.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedSeoData) {
      return res.status(404).json({ message: "SEO data not found" });
    }
    res.status(200).json({ success: true, data: updatedSeoData });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
