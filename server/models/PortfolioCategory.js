const mongoose = require("mongoose");

const PortfolioCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      trim: true,
      unique: true, // Ensures no duplicate category names
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PortfolioCategory", PortfolioCategorySchema);
