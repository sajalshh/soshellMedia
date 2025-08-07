// server/models/AboutPage.js

const mongoose = require("mongoose");

const AboutPageSchema = new mongoose.Schema({
  paragraphs: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("AboutPage", AboutPageSchema);
