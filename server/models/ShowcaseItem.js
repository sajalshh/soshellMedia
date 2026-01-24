const mongoose = require("mongoose");

const ShowcaseItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    videoUrl: {
      type: String,
      required: [true, "Please upload a video file"],
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ShowcaseItem", ShowcaseItemSchema);
