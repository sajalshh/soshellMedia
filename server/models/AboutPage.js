const mongoose = require("mongoose");

const AboutPageSchema = new mongoose.Schema(
  {
    headingPrefix: {
      type: String,
      required: true,
      default: "About",
    },
    headingHighlight: {
      type: String,
      required: true,
      default: "Soshell Media",
    },
    subHeading: {
      type: String,
      default: "",
    },
    paragraphs: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AboutPage", AboutPageSchema);
