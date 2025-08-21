const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const PortfolioCategory = require("../models/PortfolioCategory");

router.get("/", async (req, res) => {
  try {
    const categories = await PortfolioCategory.find().sort({ name: "asc" });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/", protect, authorize("client"), async (req, res) => {
  try {
    const newCategory = await PortfolioCategory.create(req.body);
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/:id", protect, authorize("client"), async (req, res) => {
  try {
    const category = await PortfolioCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/:id", protect, authorize("client"), async (req, res) => {
  const PortfolioItem = require("../models/PortfolioItem");
  const itemsInCategory = await PortfolioItem.countDocuments({
    category: req.params.id,
  });

  if (itemsInCategory > 0) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Cannot delete category, it is currently in use by portfolio items.",
      });
  }

  try {
    const category = await PortfolioCategory.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    await category.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
