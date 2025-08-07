// server/models/BlogPost.js

const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    // A URL-friendly version of the title
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // The main content of the blog post (will store HTML)
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    // A short summary for the blog overview page
    excerpt: {
      type: String,
      required: [true, "Please add an excerpt"],
    },
    featuredImage: {
      type: String, // Will store the Cloudinary URL
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    category: {
      type: String,
      default: "Uncategorized",
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  },
);

module.exports = mongoose.model("BlogPost", BlogPostSchema);
