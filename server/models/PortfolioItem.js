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
      type: mongoose.Schema.Types.ObjectId,
      ref: "PortfolioCategory", // This links to the PortfolioCategory model
      required: [true, "Please select a category"],
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
