// server/models/DevTechnology.js

const mongoose = require("mongoose");

const DevTechnologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    // Key used to resolve a brand icon on the frontend (react-icons/si set)
    iconKey: {
      type: String,
      required: [true, "Please add an icon key"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Platforms", "Frameworks", "Languages", "Tools"],
      default: "Tools",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DevTechnology", DevTechnologySchema);
