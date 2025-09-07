// server/models/ServiceCard.js

const mongoose = require("mongoose");

// A small sub-schema for the description items
const DescriptionItemSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const ServiceCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // An array of the description items
  description: [DescriptionItemSchema],
  image: {
    type: String,
    required: true,
  },
  floatingTitle: {
    type: String,
    required: true,
  },
  floatingSub: {
    type: String,
    required: true,
  },
  // We add an order field to control the display sequence
  displayOrder: {
    type: Number,
    required: true,
  },

  detailTitle: {
    type: String,
    required: true,
  },
  detailSubtitle: {
    type: String, // We'll store HTML here if needed (like the <b> tag)
    required: true,
  },
  detailImage: {
    type: String, // A specific, larger image for the details page
    required: true,
  },
  detailPoints: {
    type: [String], // An array of strings for the bullet points
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("ServiceCard", ServiceCardSchema);
