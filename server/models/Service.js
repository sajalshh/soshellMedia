// server/models/Service.js

const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  // --- Your Original Fields ---
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  subtitle: {
    type: String,
    required: [true, "Please add a subtitle"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  image: {
    type: String,
    required: [true, "Please add an image URL"],
  },
  slug: {
    type: String,
    required: [true, "Please add a URL slug"],
    unique: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },

  // --- NEW: Fields for the Service Details Page ---
  // These fields have default values to make them flexible and
  // prevent errors when editing older services.
  detailTitle: {
    type: String,
    default: "",
  },
  detailSubtitle: {
    type: String,
    default: "",
  },
  detailImage: {
    type: String,
    default: "",
  },
  detailPoints: {
    type: [String],
    default: [], // Defaults to an empty array
  },
});

module.exports = mongoose.model("Service", ServiceSchema);
