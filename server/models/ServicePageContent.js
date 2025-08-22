// server/models/ServicePageContent.js

const mongoose = require("mongoose");

const ServicePageContentSchema = new mongoose.Schema({
  // For the top "breadcrumb" section
  breadcrumbHeading: {
    type: String,
    default: "Solutions That Drive Growth",
  },
  breadcrumbDescription: {
    type: String,
    default: "Your default breadcrumb description goes here...",
  },
  // For the "popular services" section
  sectionTitle: {
    type: String,
    default: "Your Brand Reimagined",
  },
  sectionSubtitle: {
    type: String,
    default: "for the Scroll Age",
  },
});

module.exports = mongoose.model("ServicePageContent", ServicePageContentSchema);
