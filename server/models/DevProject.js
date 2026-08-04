// server/models/DevProject.js

const mongoose = require("mongoose");

const DevProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Please add a project URL"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    // Optional manual override; when empty the frontend auto-generates
    // a live thumbnail from `url` via a screenshot service.
    thumbnailOverride: {
      type: String,
      default: "",
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

module.exports = mongoose.model("DevProject", DevProjectSchema);
