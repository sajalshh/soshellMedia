// server/models/AboutTab.js

const mongoose = require("mongoose");

const AboutTabSchema = new mongoose.Schema({
  tabId: { type: String, required: true, unique: true },
  tabTitle: { type: String, required: true },
  heading: { type: String, required: true },
  paragraph: { type: String, required: true },
  listItems: { type: [String], required: true },
  // imageSrc field has been removed
});

module.exports = mongoose.model("AboutTab", AboutTabSchema);
