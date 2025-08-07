// server/models/CounterStat.js

const mongoose = require("mongoose");

const CounterStatSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
  suffix: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CounterStat", CounterStatSchema);
