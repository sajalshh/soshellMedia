// server/models/SeoData.js

const mongoose = require("mongoose");

const SeoDataSchema = new mongoose.Schema({
  // A unique identifier for the page, like its URL (e.g., '/', '/about')
  pageUrl: {
    type: String,
    required: true,
    unique: true,
  },
  // The main <title> tag for the page
  title: {
    type: String,
    required: true,
  },
  // The <meta name="description"> tag
  metaDescription: {
    type: String,
    required: true,
  },
  // --- Open Graph Tags for Social Media ---
  ogTitle: {
    type: String,
  },
  ogDescription: {
    type: String,
  },
  ogImage: {
    type: String, // URL to the social sharing image
  },
});

module.exports = mongoose.model("SeoData", SeoDataSchema);
