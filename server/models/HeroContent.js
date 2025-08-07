// server/models/HeroContent.js

const mongoose = require("mongoose");

const HeroContentSchema = new mongoose.Schema({
  headingLine1: {
    type: String,
    required: true,
  },
  headingLine2: {
    type: String,
    required: true,
  },
  headingLine3: {
    type: String,
    required: true,
  },
  subheading: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  },
  buttonLink: {
    type: String,
    required: true,
    default: "/contact",
  },
});

// We only need one document for the Hero content
module.exports = mongoose.model("HeroContent", HeroContentSchema);
