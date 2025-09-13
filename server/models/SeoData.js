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
  keywords: {
    type: [String],
    default: [],
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

  // =================== NEW FIELDS ===================
  ogUrl: {
    type: String, // The full URL that social media should link to
  },
  ogImageAlt: {
    type: String, // Alt text for the og:image
  },
  canonicalUrl: {
    type: String, // The preferred URL for this page to prevent duplicate content
  },
  schemaMarkup: {
    type: String, // A string to hold JSON-LD schema markup
  },
  // ==================================================
});

module.exports = mongoose.model("SeoData", SeoDataSchema);
