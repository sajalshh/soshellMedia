const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const PricingPlan = require("../models/PricingPlan");

// --- PUBLIC ROUTE ---
// @desc    Get all pricing plans
// @route   GET /api/pricing
// @access  Public
router.get("/", async (req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ displayOrder: "asc" });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- ADMIN ROUTES ---

// @desc    Create a new pricing plan
// @route   POST /api/pricing
// @access  Private (Admin)
router.post("/", protect, authorize("client"), async (req, res) => {
  try {
    const { features, ...otherData } = req.body;
    const newPlan = await PricingPlan.create({
      ...otherData,
      // Convert features from a newline-separated string to an array
      features: features
        ? features.split("\n").filter((f) => f.trim() !== "")
        : [],
    });
    res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Update a pricing plan
// @route   PUT /api/pricing/:id
// @access  Private (Admin)
router.put("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const { features, ...otherData } = req.body;
    const updateData = {
      ...otherData,
      features: features
        ? features.split("\n").filter((f) => f.trim() !== "")
        : [],
    };
    const updatedPlan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ success: true, data: updatedPlan });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @desc    Delete a pricing plan
// @route   DELETE /api/pricing/:id
// @access  Private (Admin)
router.delete("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    await plan.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
