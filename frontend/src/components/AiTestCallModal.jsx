import React, { useState } from "react";
import api from "../api/axiosConfig";
import "../styles/legacy.css";

export default function AiTestCallModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/ai-call/trigger", formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ name: "", email: "", phone: "" });
      }, 3000);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#151518",
          border: "1px solid var(--tp-theme-primary)",
          boxShadow: "0 0 30px rgba(3, 220, 176, 0.15)",
        }}
      >
        <div className="modal-header">
          <h4 className="modal-title tw-text-white">Test Call Simulation</h4>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {!success ? (
            <form onSubmit={handleSubmit} className="booking-form">
              <p className="tw-text-gray-400 tw-text-center tw-mb-4">
                Enter your details. Our AI will call you instantly.
              </p>

              <div className="form-group">
                <label>Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="theme-btn tw-w-full"
                disabled={loading}
              >
                {loading ? "Connecting..." : "Call Me Now"}
              </button>
            </form>
          ) : (
            <div className="tw-text-center tw-py-8">
              <h3 className="tw-text-white tw-text-2xl tw-font-bold">
                Calling You...
              </h3>
              <p className="tw-text-gray-400">Pick up your phone! 📞</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
