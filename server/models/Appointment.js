// server/models/Appointment.js

const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      // Basic email format validation
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    purpose: {
      type: String,
      required: [true, "Please provide the purpose of the meeting"],
      trim: true,
    },
    date: {
      type: Date, // We will store the full date object
      required: true,
    },
    time: {
      type: String, // We will store the time slot, e.g., "09:00", "14:30"
      required: true,
    },
    googleEventId: {
      // This is useful for storing the ID of the event we create in Google Calendar
      type: String,
    },
  },
  { timestamps: true },
); // Adds createdAt and updatedAt fields automatically

module.exports = mongoose.model("Appointment", AppointmentSchema);
