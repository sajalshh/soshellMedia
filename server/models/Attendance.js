const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // stored as "YYYY-MM-DD"
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    totalHours: {
      type: Number, // e.g. 8.5 means 8hrs 30mins
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Prevents an employee from having two records on the same day
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
