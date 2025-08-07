import React, { useState } from "react";
import SeoHelmet from "../components/SeoHelmet";

export default function ContactPage() {
  // State to hold the form data
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Handler to update state when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    console.log("Form Data Submitted:", formData);
    alert("Thank you for your message! Check the console to see the data.");
    // Here you would typically send the data to a backend
    setFormData({ name: "", phone: "", email: "", message: "" }); // Reset form
  };

  return (
    <>
      <SeoHelmet pageUrl="/contact" />
      {/* Contact Section */}
      <section
        className="contact-section fix style-padding section-padding bg-cover"
        style={{ backgroundImage: "url('assets/img/contact-bg.jpg')" }}
      >
        <div className="container">
          <div className="section-title ml-200">
            <h6 className="wow fadeInUp">
              <img src="/assets/img/star.png" alt="img" /> contact with us
            </h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Contact our experts <br />{" "}
              <span>
                any <b>assistance</b> you need
              </span>
            </h2>
          </div>
          <div className="contact-wrapper">
            <div className="row align-items-center">
              <div className="col-lg-4 wow fadeInUp" data-wow-delay=".3s">
                <div className="contact-image">
                  <img src="/assets/img/contac-img-2.jpg" alt="img" />
                </div>
              </div>
              <div className="col-lg-8">
                <div className="contact-form-items-area">
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    Get in touch
                  </h2>
                  <form onSubmit={handleSubmit} className="contact-form-items">
                    <div className="row g-4">
                      <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay=".3s"
                      >
                        <div className="form-clt">
                          <div className="icon">
                            <i className="fa-regular fa-user"></i>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                          />
                        </div>
                      </div>
                      <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        <div className="form-clt">
                          <div className="icon">
                            <i className="fa-regular fa-phone"></i>
                          </div>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                          />
                        </div>
                      </div>
                      <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay=".3s"
                      >
                        <div className="form-clt">
                          <div className="icon">
                            <i className="fa-regular fa-envelope"></i>
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email here"
                            required
                          />
                        </div>
                      </div>
                      <div
                        className="col-lg-6 wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        {/* Note: Nice Select JS plugin is not used here. This is a standard select. */}
                        <div className="form-clt">
                          <select name="subject" className="nice-select">
                            <option>Subject</option>
                            <option value="support">Support</option>
                            <option value="sales">Sales</option>
                          </select>
                        </div>
                      </div>
                      <div
                        className="col-lg-12 wow fadeInUp"
                        data-wow-delay=".3s"
                      >
                        <div className="form-clt">
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your comment"
                            required
                          ></textarea>
                          <div className="icon">
                            <i className="fa-regular fa-comment"></i>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-lg-7 wow fadeInUp"
                        data-wow-delay=".5s"
                      >
                        <button type="submit" className="theme-btn">
                          Send message{" "}
                          <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="map-items">
        <div className="googpemap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.1197639734484!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1612427435934!5m2!1sen!2sbd"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="contact-info-section fix section-padding">
        {/* ... JSX for contact info boxes ... */}
      </section>
    </>
  );
}
