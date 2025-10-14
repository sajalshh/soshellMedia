import React, { useState } from "react";
import SeoHelmet from "../components/SeoHelmet";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

// --- A reusable component for the modern form inputs with floating labels ---
const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
}) => (
  <div className="tw-relative tw-z-0 tw-w-full">
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="tw-block tw-py-3 tw-px-0 tw-w-full tw-text-white tw-bg-transparent tw-border-0 tw-border-b-2 tw-border-gray-600 tw-appearance-none focus:tw-outline-none focus:tw-ring-0 focus:tw-border-[var(--tp-theme-primary)] tw-peer"
      placeholder=" "
      required={required}
    />
    <label
      htmlFor={id}
      className="tw-absolute tw-text-gray-400 tw-duration-300 tw-transform -tw-translate-y-6 tw-scale-75 tw-top-3 -tw-z-10 tw-origin-[0] peer-focus:tw-left-0 peer-focus:tw-text-[var(--tp-theme-primary)] peer-placeholder-shown:tw-scale-100 peer-placeholder-shown:tw-translate-y-0 peer-focus:tw-scale-75 peer-focus:-tw-translate-y-6"
    >
      {label}
    </label>
  </div>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message!");
    setFormData({ name: "", phone: "", email: "", message: "" });
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
                {/* <h6>
                  <img src="/assets/img/star.png" alt="img" /> contact with us
                </h6> */}
                <h2>
                  Contact our experts <br />
                  <span>
                    any <b>assistance</b> you need
                  </span>
                </h2>
                <p className="tw-text-gray-300 tw-mt-4 tw-max-w-md">
                  Have a project, a question, or just want to connect? We're
                  here to help. Reach out directly or use the form to send us a
                  message.
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
                      href="mailto:info@soshellmedia.com"
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

            {/* --- RIGHT COLUMN: Beautified Form --- */}
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
                    className="theme-btn tw-w-full md:tw-w-auto hover:tw-shadow-[0_0_15px_var(--tp-theme-primary)] tw-transition-shadow"
                  >
                    Send Message{" "}
                    <Send className="tw-inline tw-ml-2" size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Map Section is now commented out as requested --- */}
      {/*
      <div className="map-items">
        <div className="googpemap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.1197639734484!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1612427435934!5m2!1sen!2sbd"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Location of our office on Google Maps"
          ></iframe>
        </div>
      </div>
      */}

      {/* The contact info boxes can be removed if this new design replaces them, or kept if they serve a different purpose. */}
      {/* <section className="contact-info-section fix section-padding">...</section> */}
    </>
  );
}
