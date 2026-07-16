// server/routes/appointmentRoutes.js

const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { calendar } = require("../config/googleClient");
const { format } = require("date-fns");
const sendEmail = require("../services/emailService");
const appointmentAdminTemplate = require("../templates/appointmentAdminTemplate");
const appointmentCustomerTemplate = require("../templates/appointmentCustomerTemplate");

// Runs AFTER the user has already gotten their success response.
// Creates the Google Calendar event and sends notification emails.
// Any failure here is logged only — it must never affect the user's booking,
// which is already saved in the database.
async function processBookingInBackground(
  appointment,
  { name, email, phone, purpose, date, time },
) {
  // --- Google Calendar event ---
  try {
    const dateString = date; // e.g. "2025-08-27"
    const startDateTimeString = `${dateString}T${time}:00`; // "2025-08-27T11:00:00"

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
        dateTime: startDateTimeString,
        timeZone: "America/Toronto",
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

    appointment.googleEventId = calendarResponse.data.id;
    await appointment.save();

    console.log("SUCCESS: Calendar event created with correct time zone.");
  } catch (calendarError) {
    console.error(
      "Background: calendar event failed:",
      calendarError.response
        ? calendarError.response.data.error
        : calendarError.message,
    );
  }

  // --- Notification emails ---
  try {
    // Email to ADMIN
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📅 New Appointment - ${name} (${date} ${time})`,
      html: appointmentAdminTemplate({
        name,
        email,
        phone,
        purpose,
        date,
        time,
      }),
    });

    // Confirmation email to CUSTOMER
    await sendEmail({
      to: email,
      subject: "✅ Your appointment is confirmed - Soshell Media",
      html: appointmentCustomerTemplate({ name, date, time }),
    });
  } catch (emailError) {
    console.error("Background: sending emails failed:", emailError.message);
  }
}

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

    // --- 2. Respond to the user IMMEDIATELY (fast UX) ---
    // The slot is already reserved in the DB above. The Google Calendar event
    // and notification emails are slow (external APIs), so we run them in the
    // background AFTER responding, instead of making the user wait for them.
    res.status(201).json({ success: true, data: newAppointment });

    // --- 3. Background work (calendar event + emails) — not awaited by client ---
    processBookingInBackground(newAppointment, {
      name,
      email,
      phone,
      purpose,
      date,
      time,
    }).catch((bgError) => {
      console.error("Background booking task failed:", bgError.message);
    });
  } catch (error) {
    console.error(
      "Booking Error:",
      error.response ? error.response.data.error : error.message,
    );
    res
      .status(500)
      .json({ success: false, message: "Failed to book appointment." });
  }
});

module.exports = router;
