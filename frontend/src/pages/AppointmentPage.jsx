// src/pages/AppointmentPage.jsx

import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Fade } from "react-awesome-reveal";
import { format } from "date-fns";
import SeoHelmet from "../components/SeoHelmet";
import Modal from "../components/Modal";
import api from "../api/axiosConfig";

export default function AppointmentPage() {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --- 1. NEW STATE FOR THE FORM ---
  const [selectedSlot, setSelectedSlot] = useState(null); // To store the chosen time
  const [formData, setFormData] = useState({
    // To store user input
    name: "",
    email: "",
    phone: "",
    purpose: "",
  });
  // State for the booking process: 'idle', 'booking', 'success', 'error'
  const [bookingState, setBookingState] = useState({
    status: "idle",
    message: "",
  });

  // This effect fetches booked slots when a date is selected
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      const allSlots = [];
      for (let i = 9; i <= 18; i++) {
        // 9 AM to 6 PM
        allSlots.push(`${String(i).padStart(2, "0")}:00`);
      }

      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await api.get(`/appointments/${formattedDate}`);
        const bookedSlots = response.data.data;
        const available = allSlots.filter(
          (slot) => !bookedSlots.includes(slot),
        );
        setAvailableSlots(available);
      } catch (error) {
        console.error("Failed to fetch time slots:", error);
        setAvailableSlots(allSlots);
      } finally {
        setLoadingSlots(false);
        setIsModalOpen(true);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  // --- 2. NEW EVENT HANDLERS FOR THE FORM ---
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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
          "Success! Your appointment is booked. We will contact you soon",
      });
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingState({
        status: "error",
        message: "Sorry, something went wrong. Please try again.",
      });
    }
  };

  // Function to reset the state and close the modal
  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setBookingState({ status: "idle", message: "" });
    setFormData({ name: "", email: "", phone: "", purpose: "" });
  };

  return (
    <>
      <SeoHelmet pageUrl="/appointment" />

      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <Fade direction="up" triggerOnce>
              <h1>
                Book a <span className="text-neon">Discovery Call</span>
              </h1>
            </Fade>
          </div>
        </div>
      </div>

      <section className="appointment-section section-padding section-bg">
        <div className="container">
          <div className="appointment-wrapper">
            <div className="section-title text-center">
              <Fade direction="up" triggerOnce>
                <h2>Select a Date</h2>
                <p>Choose a day that works best for you.</p>
              </Fade>
            </div>

            <div className="day-picker-container">
              <Fade direction="up" delay={300} triggerOnce>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  className="rdp-custom"
                />
              </Fade>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. MODAL JSX IS NOW MORE ADVANCED --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModalAndReset}
        title={
          bookingState.status === "success"
            ? "Appointment Confirmed!"
            : selectedSlot
            ? `Confirm Booking for ${selectedSlot}`
            : `Available Slots for ${
                selectedDate ? selectedDate.toLocaleDateString() : ""
              }`
        }
      >
        {/* If the booking was successful, show a success message */}
        {bookingState.status === "success" && (
          <div className="booking-status-message success">
            <p>{bookingState.message}</p>
            <button onClick={closeModalAndReset} className="theme-btn mt-3">
              Close
            </button>
          </div>
        )}

        {/* If the booking failed, show an error message */}
        {bookingState.status === "error" && (
          <div className="booking-status-message error">
            <p>{bookingState.message}</p>
            <button
              onClick={() => setBookingState({ status: "idle" })}
              className="theme-btn mt-3"
            >
              Try Again
            </button>
          </div>
        )}

        {/* If we are currently booking, show a loading message */}
        {bookingState.status === "booking" && (
          <div className="booking-status-message">
            <p>{bookingState.message}</p>
          </div>
        )}

        {/* This is the main view when the modal opens */}
        {bookingState.status === "idle" && (
          <>
            {/* If a slot hasn't been selected yet, show the time slots */}
            {!selectedSlot ? (
              loadingSlots ? (
                <p>Finding available times...</p>
              ) : (
                <div className="time-slots-container">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button
                        key={slot}
                        className="time-slot-btn"
                        onClick={() => handleSlotSelect(slot)}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p>
                      No available slots for this day. Please select another
                      date.
                    </p>
                  )}
                </div>
              )
            ) : (
              // If a slot IS selected, show the booking form
              <form className="booking-form" onSubmit={handleFormSubmit}>
                <p className="booking-form-summary">
                  You are booking for{" "}
                  <strong>{selectedDate.toLocaleDateString()}</strong> at{" "}
                  <strong>{selectedSlot}</strong>.
                </p>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="purpose">Purpose of Meeting</label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    rows="3"
                    value={formData.purpose}
                    onChange={handleFormChange}
                    required
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => setSelectedSlot(null)}
                  >
                    Back
                  </button>
                  <button type="submit" className="theme-btn">
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
