const mongoose = require("mongoose");

const PricingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [String], required: true },
  billingCycle: {
    type: String,
    enum: ["monthly", "annual"], // Ensures only these two values are allowed
    required: true,
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("PricingPlan", PricingPlanSchema);
