// server/models/CaseStudy.js

const mongoose = require("mongoose");

const CaseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    excerpt: {
      type: String,
      required: [true, "Please add an excerpt"],
    },
    featuredImage: {
      type: String, // Will store the Cloudinary URL
      required: true,
    },
    client: {
      type: String,
      default: "Confidential",
    },
    industry: {
      type: String,
      default: "General",
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    keywords: {
      type: String, // Storing as a comma-separated string
      trim: true,
    },
    altTag: {
      type: String, // Alt tag for the featured image
      trim: true,
    },
    canonicalTag: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  },
);

module.exports = mongoose.model("CaseStudy", CaseStudySchema);
