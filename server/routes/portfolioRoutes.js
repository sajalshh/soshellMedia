// server/routes/portfolioRoutes.js

const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const PortfolioItem = require("../models/PortfolioItem");

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ displayOrder: "asc" });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Create a new portfolio item
// @route   POST /api/portfolio
// @access  Private (Client)
router.post("/", protect, authorize("client"), async (req, res) => {
  try {
    const newItem = await PortfolioItem.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update a portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private (Client)
router.put("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete a portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private (Client)
router.delete("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    await item.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
