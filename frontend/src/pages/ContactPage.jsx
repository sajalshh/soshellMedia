import React, { useState } from "react";
import SeoHelmet from "../components/SeoHelmet";
import { motion } from "framer-motion";
import { Mail, Phone, Send } from "lucide-react";
import api from "../api/axiosConfig";

// --- A reusable component for the modern form inputs with floating labels ---
const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) => {
  const baseClass =
    "tw-block tw-py-3 tw-px-0 tw-w-full tw-text-white tw-bg-transparent tw-border-0 tw-border-b-2 tw-border-gray-600 tw-appearance-none focus:tw-outline-none focus:tw-ring-0 focus:tw-border-[var(--tp-theme-primary)] tw-peer";

  return (
    <div className="tw-relative tw-z-0 tw-w-full">
      {type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={baseClass}
          placeholder=" "
          required={required}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={baseClass}
          placeholder=" "
          required={required}
        />
      )}

      <label
        htmlFor={id}
        className="tw-absolute tw-text-gray-400 tw-duration-300 tw-transform -tw-translate-y-6 tw-scale-75 tw-top-3 -tw-z-10 tw-origin-[0] peer-focus:tw-left-0 peer-focus:tw-text-[var(--tp-theme-primary)] peer-placeholder-shown:tw-scale-100 peer-placeholder-shown:tw-translate-y-0 peer-focus:tw-scale-75 peer-focus:-tw-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "idle", // idle | loading | success | error
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: "loading", message: "Sending..." });

    try {
      await api.post("/contact", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        category: formData.category,
        message: formData.message,
      });

      setStatus({
        type: "success",
        message: "Message sent successfully! We’ll contact you soon.",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        category: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form submit failed:", err);
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <>
      <SeoHelmet pageUrl="/contact" />

      <section
        className="contact-section fix section-padding bg-cover"
        style={{ backgroundImage: "url('assets/img/contact-bg.jpg')" }}
      >
        <div className="container">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-16 tw-items-center">
            {/* --- LEFT COLUMN: Contact Info & Title --- */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              <div className="section-title">
                <h2>
                  Got Something you're <b>Building?</b>
                  <br />
                  <span>
                    Questions, ideas or half baked plans...
                    <br />
                    <b>We're all ears</b>
                  </span>
                </h2>

                <p className="tw-text-gray-300 tw-mt-4 tw-max-w-md">
                  Reach out directly or use the form to send us a message.
                </p>
              </div>

              <div className="tw-mt-10 tw-space-y-8">
                <div className="tw-flex tw-items-center tw-gap-4">
                  <div className="tw-w-14 tw-h-14 tw-bg-[var(--tp-theme-primary)]/10 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                    <Mail
                      className="tw-text-[var(--tp-theme-primary)]"
                      size={24}
                    />
                  </div>

                  <div>
                    <h3 className="tw-text-white tw-font-semibold tw-text-xl">
                      Email Us
                    </h3>
                    <a
                      href="mailto:info@soshellmedia.co"
                      className="tw-text-gray-400 hover:tw-text-[var(--tp-theme-primary)]"
                    >
                      info@soshellmedia.co
                    </a>
                  </div>
                </div>

                <div className="tw-flex tw-items-center tw-gap-4">
                  <div className="tw-w-14 tw-h-14 tw-bg-[var(--tp-theme-primary)]/10 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                    <Phone
                      className="tw-text-[var(--tp-theme-primary)]"
                      size={24}
                    />
                  </div>

                  <div>
                    <h3 className="tw-text-white tw-font-semibold tw-text-xl">
                      Call Us
                    </h3>
                    <a
                      href="tel:+16478970671"
                      className="tw-text-gray-400 hover:tw-text-[var(--tp-theme-primary)]"
                    >
                      +1 (647) 897-0671
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* --- RIGHT COLUMN: Form --- */}
            <motion.div
              className="tw-bg-[#1A1A1E]/80 tw-backdrop-blur-lg tw-p-8 md:tw-p-12 tw-rounded-2xl tw-border tw-border-[rgba(207,208,212,0.2)]"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              <h2 className="tw-text-3xl tw-font-bold tw-text-white tw-mb-8">
                Get in touch
              </h2>

              {status.type === "error" && (
                <div className="alert alert-danger">{status.message}</div>
              )}
              {status.type === "success" && (
                <div className="alert alert-success">{status.message}</div>
              )}

              <form onSubmit={handleSubmit} className="tw-space-y-8">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
                  <FloatingLabelInput
                    id="name"
                    label="Your Name*"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <FloatingLabelInput
                    id="phone"
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <FloatingLabelInput
                  id="email"
                  label="Email Address*"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                {/* Category Dropdown */}
                <div>
                  <label className="tw-text-gray-400 tw-text-sm">
                    Category*
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="tw-mt-2 tw-w-full tw-bg-transparent tw-text-white tw-border-0 tw-border-b-2 tw-border-gray-600 tw-py-3 focus:tw-outline-none focus:tw-border-[var(--tp-theme-primary)]"
                  >
                    <option value="" className="tw-text-black">
                      Select category
                    </option>
                    <option value="Real estate" className="tw-text-black">
                      Real estate
                    </option>
                    <option value="Lawyer" className="tw-text-black">
                      Lawyer
                    </option>
                    <option value="E-commerce" className="tw-text-black">
                      E-commerce
                    </option>
                    <option value="Coach" className="tw-text-black">
                      Coach
                    </option>
                    <option value="Consultant" className="tw-text-black">
                      Consultant
                    </option>
                  </select>
                </div>

                <FloatingLabelInput
                  id="message"
                  label="Write your message...*"
                  type="textarea"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

                <div>
                  <button
                    type="submit"
                    disabled={status.type === "loading"}
                    className="theme-btn tw-w-full md:tw-w-auto hover:tw-shadow-[0_0_15px_var(--tp-theme-primary)] tw-transition-shadow"
                  >
                    {status.type === "loading" ? "Sending..." : "Send Message"}{" "}
                    <Send className="tw-inline tw-ml-2" size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
