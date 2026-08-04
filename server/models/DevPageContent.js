// server/models/DevPageContent.js

const mongoose = require("mongoose");

const DevPageContentSchema = new mongoose.Schema({
  // Breadcrumb / hero
  badgeText: {
    type: String,
    default: "web & app development",
  },
  heading: {
    type: String,
    default: "We Build Websites & Apps That Actually Convert",
  },
  description: {
    type: String,
    default:
      "From Shopify storefronts to custom Next.js platforms — we design, build, and ship fast, scalable products on the tools that fit your business best.",
  },

  // Tech stack section
  techSectionTitle: {
    type: String,
    default: "Our Tech Stack",
  },
  techSectionSubtitle: {
    type: String,
    default: "Platforms & Tools We Build With",
  },

  // Showcase section
  showcaseSectionTitle: {
    type: String,
    default: "Recent Work",
  },
  showcaseSectionSubtitle: {
    type: String,
    default: "Projects We're Proud Of",
  },

  // Process section
  processSectionTitle: {
    type: String,
    default: "How We Work",
  },
  processSectionSubtitle: {
    type: String,
    default: "Our Development Process",
  },

  // CTA
  ctaHeading: {
    type: String,
    default: "Got a Project in Mind?",
  },
  ctaSubheading: {
    type: String,
    default: "Let's build something fast, functional, and future-proof.",
  },
});

module.exports = mongoose.model("DevPageContent", DevPageContentSchema);
