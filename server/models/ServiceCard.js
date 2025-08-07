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
});

module.exports = mongoose.model("ServiceCard", ServiceCardSchema);
