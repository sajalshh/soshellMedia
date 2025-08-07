// server/models/AboutTab.js

const mongoose = require("mongoose");

const AboutTabSchema = new mongoose.Schema({
  // Unique identifier to link with the frontend tab state (e.g., 'mission', 'vision')
  tabId: {
    type: String,
    required: true,
    unique: true,
  },
  // The title displayed on the tab itself (e.g., 'Content Ideas')
  tabTitle: {
    type: String,
    required: true,
  },
  // The main heading inside the tab content
  heading: {
    type: String,
    required: true,
  },
  // The paragraph text
  paragraph: {
    type: String,
    required: true,
  },
  // The three bullet points
  listItems: {
    type: [String],
    required: true,
  },
  // The image associated with the tab
  imageSrc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("AboutTab", AboutTabSchema);
