// server/models/AboutSectionContent.js
const mongoose = require("mongoose");

const AboutSectionContentSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
    default: "https://fast.wistia.net/embed/iframe/djiv5ywnyy", // A default placeholder
  },
});

module.exports = mongoose.model(
  "AboutSectionContent",
  AboutSectionContentSchema,
);
