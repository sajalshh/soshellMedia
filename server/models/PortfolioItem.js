// server/models/PortfolioItem.js

const mongoose = require("mongoose");

const PortfolioItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: ["Creative", "Marketing", "Development"],
    },
    videoUrl: {
      type: String,
      required: [true, "Please add a Wistia video URL"],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PortfolioItem", PortfolioItemSchema);
