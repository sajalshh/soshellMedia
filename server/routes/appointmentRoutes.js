// server/routes/appointmentRoutes.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { calendar } = require("../config/googleClient");
const { format } = require("date-fns");

// GET route for fetching booked slots
router.get("/:date", async (req, res) => {
  try {
    const selectedDate = new Date(req.params.date);
    const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999));
    const appointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    const bookedSlots = appointments.map((app) => app.time);
    res.status(200).json({ success: true, data: bookedSlots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// POST route for booking an appointment (FINAL TIME ZONE FIX)
router.post("/book", async (req, res) => {
  try {
    const { name, email, phone, purpose, date, time } = req.body;

    // --- 1. Save to database ---
    const newAppointment = await Appointment.create({
      name,
      email,
      phone,
      purpose,
      date: new Date(date),
      time,
    });

    // --- 2. Create Google Calendar event ---

    // THIS IS THE FIX: We build a simple date-time string WITHOUT UTC conversion.
    // This creates a string like "2025-08-27"
    const dateString = format(new Date(date), "yyyy-MM-dd");

    // This creates a string like "2025-08-27T11:00:00"
    const startDateTimeString = `${dateString}T${time}:00`;

    // Calculate the end time by adding one hour
    const [hour, minute] = time.split(":").map(Number);
    const endDateTimeString = `${dateString}T${String(hour + 1).padStart(
      2,
      "0",
    )}:${String(minute).padStart(2, "0")}:00`;

    const event = {
      summary: `Meeting with ${name}`,
      description: `Purpose: ${purpose}\nPhone: ${phone}\nEmail: ${email}`,
      start: {
        dateTime: startDateTimeString, // Send the "local" time string
        timeZone: "America/Toronto", // Tell Google what time zone it's in
      },
      end: {
        dateTime: endDateTimeString,
        timeZone: "America/Toronto",
      },
      attendees: [{ email: email }],
    };

    const calendarResponse = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    newAppointment.googleEventId = calendarResponse.data.id;
    await newAppointment.save();

    console.log("SUCCESS: Calendar event created with correct time zone.");

    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    console.error(
      "Booking Error:",
      error.response ? error.response.data.error : error.message,
    );
    res
      .status(500)
      .json({ success: false, message: "Failed to create calendar event." });
  }
});

module.exports = router;
