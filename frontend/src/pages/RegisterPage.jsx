import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Registering with:", formData);
    alert("Registration submitted! Check the console for the data.");
    // In a real app, you would send this to your backend to create a new user
  };

  return (
    <section
      className="login-section section-padding fix bg-cover"
      style={{ backgroundImage: "url('/assets/img/service/Pattern.png')" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="login-wrapper">
              <div className="row">
                <div className="col-xl-6">
                  <div className="sign-img">
                    <img src="/assets/img/register.jpg" alt="img" />
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="signin-item">
                    <div className="sign-header">
                      <h3>Sign Up for AIForge</h3>
                      <p>Choose one of the following sign-up methods</p>
                    </div>
                    <div className="social-icon">
                      <a href="#">
                        <i className="fa-brands fa-google"></i> Sign up with
                        Google
                      </a>
                      <a href="#">
                        <i className="fa-brands fa-apple"></i>
                      </a>
                      <a href="#">
                        <i className="fa-brands fa-facebook"></i>
                      </a>
                    </div>
                    <h5>or sign up using your email</h5>
                    <form onSubmit={handleSubmit} className="mt-4">
                      <div className="input-item">
                        <span className="lable-text">Your Name</span>
                        <input
                          type="text"
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <div className="icon">
                          <i className="fa-regular fa-user"></i>
                        </div>
                      </div>
                      <div className="input-item">
                        <span className="lable-text">Email Address</span>
                        <input
                          id="email"
                          type="email"
                          placeholder="info@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <div className="icon">
                          <i className="fa-regular fa-envelope"></i>
                        </div>
                      </div>
                      <div className="input-item">
                        <span className="lable-text">Password</span>
                        <input
                          id="password"
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <div className="icon">
                          <i className="fa-solid fa-eye-slash"></i>
                        </div>
                      </div>
                      <div className="button-items">
                        <button type="submit" className="theme-btn">
                          Sign Up{" "}
                          <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                        </button>
                      </div>
                      <p>
                        Already have an account?{" "}
                        <Link to="/login">Sign In</Link>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
