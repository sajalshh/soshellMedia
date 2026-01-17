// src/pages/AppointmentPage.jsx

import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Fade } from "react-awesome-reveal";
import { format } from "date-fns";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState(undefined);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
  });

  const [bookingState, setBookingState] = useState({
    status: "idle", // idle | booking | success | error
    message: "",
  });

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      setBookingState({ status: "idle", message: "" });

      const allSlots = [];
      for (let i = 9; i <= 18; i++) {
        allSlots.push(`${String(i).padStart(2, "0")}:00`);
      }

      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await api.get(`/appointments/${formattedDate}`);
        const bookedSlots = response.data.data || [];

        const available = allSlots.filter(
          (slot) => !bookedSlots.includes(slot),
        );
        setAvailableSlots(available);
      } catch (error) {
        console.error("Failed to fetch time slots:", error);
        setAvailableSlots(allSlots);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingState({ status: "idle", message: "" });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) {
      setBookingState({
        status: "error",
        message: "Please select a date and time slot first.",
      });
      return;
    }

    setBookingState({
      status: "booking",
      message: "Scheduling your appointment...",
    });

    const appointmentData = {
      ...formData,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedSlot,
    };

    try {
      await api.post("/appointments/book", appointmentData);

      setBookingState({
        status: "success",
        message:
          "Success! Your appointment is booked. We will contact you soon.",
      });

      // Optional: reset form after success
      setFormData({ name: "", email: "", phone: "", purpose: "" });
      setSelectedSlot(null);
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingState({
        status: "error",
        message: "Sorry, something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <SeoHelmet pageUrl="/appointment" />

      {/* ✅ Page Title (No Breadcrumb) */}
      <section className="section-bg tw-pt-36 tw-pb-6">
        <div className="container tw-text-center">
          <Fade direction="up" triggerOnce>
            <h1 className="tw-text-white tw-text-3xl md:tw-text-5xl tw-font-semibold">
              Select <b>Date</b> & <b>Time</b>
            </h1>
          </Fade>

          <Fade direction="up" delay={150} triggerOnce>
            <p className="tw-text-white/70 tw-mt-2">
              Pick a date, choose a slot, and confirm your booking.
            </p>
          </Fade>
        </div>
      </section>

      <section className="appointment-section section-padding section-bg">
        <div className="container">
          {/* MAIN GRID */}
          <div className="row tw-mt-6 tw-gap-y-10">
            {/* LEFT SIDE: Date Picker */}
            <div className="col-lg-5">
              <div className="tw-rounded-2xl tw-bg-black/40 tw-border tw-border-white/10 tw-p-6 tw-backdrop-blur-lg">
                <h3 className="tw-text-white tw-text-xl tw-font-semibold tw-mb-4">
                  Select a Date
                </h3>

                <div className="day-picker-container">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                    className="rdp-custom"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Slots + Form */}
            <div className="col-lg-7">
              <div
                className="tw-rounded-2xl tw-border tw-border-white/10 tw-p-6 tw-backdrop-blur-lg tw-bg-gradient-to-br tw-from-[#00ffcc1a] tw-via-[#184940cc] tw-to-[#0b1f1c]"
              >
                {/* Header */}
                <div className="tw-flex tw-items-start tw-justify-between tw-gap-4 tw-flex-wrap">
                  <div>
                    <h3 className="tw-text-white tw-text-xl tw-font-semibold">
                      Available Slots
                    </h3>
                    <p className="tw-text-white/70 tw-mt-1">
                      {selectedDate
                        ? `For ${selectedDate.toLocaleDateString()}`
                        : "Select a date to view time slots."}
                    </p>
                  </div>

                  {selectedSlot && (
                    <div className="tw-text-sm tw-text-white/80">
                      Selected:{" "}
                      <span className="tw-text-[var(--tp-theme-primary)] tw-font-semibold">
                        {selectedSlot}
                      </span>
                    </div>
                  )}
                </div>

                {/* Slots */}
                <div className="tw-mt-5">
                  {!selectedDate ? (
                    <div className="tw-text-white/60 tw-text-sm">
                      Please select a date from the calendar on the left.
                    </div>
                  ) : loadingSlots ? (
                    <div className="tw-text-white/60 tw-text-sm">
                      Finding available times...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="tw-text-white/60 tw-text-sm">
                      No available slots for this day. Please select another
                      date.
                    </div>
                  ) : (
                    <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 tw-gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleSlotSelect(slot)}
                          className={`tw-py-2 tw-rounded-xl tw-border tw-transition tw-text-sm tw-font-medium
                            ${
                              selectedSlot === slot
                                ? "tw-bg-[var(--tp-theme-primary)] tw-text-black tw-border-[var(--tp-theme-primary)]"
                                : "tw-bg-white/5 tw-text-white tw-border-white/10 hover:tw-border-[var(--tp-theme-primary)]"
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* FORM */}
                <div className="tw-mt-8">
                  <h4 className="tw-text-white tw-text-lg tw-font-semibold">
                    Your Details
                  </h4>

                  <p className="tw-text-white/60 tw-text-sm tw-mt-1">
                    Fill the form to confirm your appointment.
                  </p>

                  {/* Status Message */}
                  {bookingState.status !== "idle" && (
                    <div
                      className={`tw-mt-4 tw-rounded-xl tw-p-3 tw-text-sm tw-border
                        ${
                          bookingState.status === "success"
                            ? "tw-bg-green-500/10 tw-border-green-500/30 tw-text-green-200"
                            : bookingState.status === "error"
                            ? "tw-bg-red-500/10 tw-border-red-500/30 tw-text-red-200"
                            : "tw-bg-white/5 tw-border-white/10 tw-text-white/70"
                        }`}
                    >
                      {bookingState.message}
                    </div>
                  )}

                  <form className="tw-mt-5" onSubmit={handleFormSubmit}>
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-4">
                      <div>
                        <label className="tw-text-white/70 tw-text-sm">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          className="tw-w-full tw-mt-2 tw-rounded-xl tw-bg-white/5 tw-border tw-border-white/10 tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/40 focus:tw-outline-none focus:tw-border-[var(--tp-theme-primary)]"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="tw-text-white/70 tw-text-sm">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          className="tw-w-full tw-mt-2 tw-rounded-xl tw-bg-white/5 tw-border tw-border-white/10 tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/40 focus:tw-outline-none focus:tw-border-[var(--tp-theme-primary)]"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="tw-text-white/70 tw-text-sm">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          required
                          className="tw-w-full tw-mt-2 tw-rounded-xl tw-bg-white/5 tw-border tw-border-white/10 tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/40 focus:tw-outline-none focus:tw-border-[var(--tp-theme-primary)]"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="sm:tw-col-span-2">
                        <label className="tw-text-white/70 tw-text-sm">
                          Purpose of Meeting
                        </label>
                        <textarea
                          name="purpose"
                          rows="3"
                          value={formData.purpose}
                          onChange={handleFormChange}
                          required
                          className="tw-w-full tw-mt-2 tw-rounded-xl tw-bg-white/5 tw-border tw-border-white/10 tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/40 focus:tw-outline-none focus:tw-border-[var(--tp-theme-primary)]"
                          placeholder="Tell us what you need help with..."
                        />
                      </div>
                    </div>

                    <div className="tw-mt-5 tw-flex tw-items-center tw-justify-between tw-gap-3 tw-flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedSlot(null)}
                        className="tw-text-white/70 hover:tw-text-white tw-transition tw-text-sm"
                      >
                        Clear Selected Slot
                      </button>

                      <button
                        type="submit"
                        disabled={
                          !selectedDate ||
                          !selectedSlot ||
                          bookingState.status === "booking"
                        }
                        className={`theme-btn contact-btn !tw-inline-flex tw-items-center tw-justify-center
                          ${
                            !selectedDate ||
                            !selectedSlot ||
                            bookingState.status === "booking"
                              ? "tw-opacity-50 tw-cursor-not-allowed"
                              : ""
                          }`}
                      >
                        {bookingState.status === "booking"
                          ? "Booking..."
                          : "Confirm Booking"}
                      </button>
                    </div>
                  </form>

                  {!selectedSlot && selectedDate && (
                    <p className="tw-mt-4 tw-text-white/50 tw-text-xs">
                      Select a time slot above to enable booking.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* END GRID */}
        </div>
      </section>
    </>
  );
}
