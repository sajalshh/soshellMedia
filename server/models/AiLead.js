const mongoose = require("mongoose");

const aiLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending", // pending, called, failed
    },
    aiSystemId: {
      type: Number, // ID from the Python Backend
    },
    callSid: {
      type: String, // Twilio Call ID
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AiLead", aiLeadSchema);
