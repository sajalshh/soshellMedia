const Appointment = require("../models/Appointment");
const { calendar } = require("../config/googleClient");

async function syncAppointments() {
  try {
    // 1. Fetch upcoming events from Google Calendar
    const eventsRes = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const googleEvents = eventsRes.data.items;

    // 2. Get all DB appointments that are upcoming
    const dbAppointments = await Appointment.find({
      date: { $gte: new Date() },
    });

    // 3. Build a Set of active Google Event IDs
    const activeGoogleEventIds = new Set(
      googleEvents
        .filter((event) => event.status !== "cancelled") // ignore cancelled
        .map((event) => event.id),
    );

    // 4. Compare DB vs Google Calendar
    for (let dbApp of dbAppointments) {
      if (!activeGoogleEventIds.has(dbApp.googleEventId)) {
        console.log(
          `❌ Appointment cancelled in Google Calendar: ${dbApp._id}`,
        );

        // Option A: Delete it
        await Appointment.findByIdAndDelete(dbApp._id);

        // Option B: Keep history instead of deleting
        // await Appointment.findByIdAndUpdate(dbApp._id, { status: "cancelled" });
      }
    }

    console.log("✅ Sync complete");
  } catch (error) {
    console.error("Sync error:", error.message);
  }
}

module.exports = { syncAppointments };
