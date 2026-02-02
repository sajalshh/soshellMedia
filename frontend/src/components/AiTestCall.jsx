import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";
import api from "../api/axiosConfig";
import "../styles/legacy.css";

export default function AiTestCall() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/ai-call/trigger", formData);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setFormData({ name: "", email: "", phone: "" });
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check the number and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- 1. The Compact CTA Section --- */}
      {/* Top padding removed to fix the margin issue */}
      <section className="section-bg fix" style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <Fade direction="up" triggerOnce>
                <div
                  className="glow-teal-border"
                  style={{
                    background: "rgba(15, 15, 20, 0.8)",
                    padding: "40px",
                    borderRadius: "20px",
                    border: "1px solid rgba(3, 220, 176, 0.3)",
                  }}
                >
                  <h3 className="tw-text-3xl tw-font-bold tw-text-white tw-mb-4">
                    Experience the Future Now
                  </h3>
                  {/* UPDATED COPY BELOW */}
                  <p className="tw-text-gray-400 tw-mb-6 tw-text-lg">
                    Don't just take our word for it. Speak with our{" "}
                    <strong>AI Receptionist</strong> in real-time. It seamlessly
                    answers questions, handles objections, and schedules
                    meetings instantly.
                  </p>

                  <button
                    onClick={() => setIsOpen(true)}
                    className="theme-btn"
                    style={{ cursor: "pointer" }}
                  >
                    Call my 24/7 AI Assistant
                    <i className="fa-sharp fa-regular fa-phone tw-ml-2"></i>
                  </button>
                </div>
              </Fade>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. The Pop-up Modal --- */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#151518",
              border: "1px solid var(--tp-theme-primary)",
              boxShadow: "0 0 30px rgba(3, 220, 176, 0.15)",
            }}
          >
            <div className="modal-header tw-border-b tw-border-gray-800">
              <h4 className="modal-title tw-text-white">
                Test Call Simulation
              </h4>
              <button
                className="modal-close-btn"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body tw-p-2">
              {!success ? (
                <form onSubmit={handleSubmit} className="booking-form">
                  <p className="tw-text-gray-400 tw-mb-4 tw-text-sm tw-text-center">
                    Enter your details. Our AI will call your phone immediately.
                  </p>

                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Email (for context)</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+15550000000"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="theme-btn tw-w-full tw-mt-4 tw-flex tw-justify-center tw-items-center"
                  >
                    {loading ? (
                      <span>Connecting...</span>
                    ) : (
                      <span>Call Me Now</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="tw-text-center tw-py-8">
                  <div
                    className="tw-w-16 tw-h-16 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4"
                    style={{ background: "rgba(3, 220, 176, 0.2)" }}
                  >
                    <i
                      className="fa-solid fa-phone-volume tw-text-2xl"
                      style={{ color: "#03dcb0" }}
                    ></i>
                  </div>
                  <h3 className="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">
                    Calling You...
                  </h3>
                  {/* UPDATED SUCCESS MESSAGE */}
                  <p className="tw-text-gray-400">
                    Pick up your phone! The AI Receptionist is on the line.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
