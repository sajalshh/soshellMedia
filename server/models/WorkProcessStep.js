const mongoose = require("mongoose");

const WorkProcessStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // This will store the Cloudinary URL
    required: true,
  },
  displayOrder: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("WorkProcessStep", WorkProcessStepSchema);
