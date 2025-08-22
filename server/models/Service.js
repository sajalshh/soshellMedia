// server/models/Service.js

const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Service", ServiceSchema);
