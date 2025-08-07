// server/models/Project.js

const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Will store the Cloudinary URL
    required: true,
  },
  projectLink: {
    type: String,
    default: "/project",
  },
  displayOrder: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
