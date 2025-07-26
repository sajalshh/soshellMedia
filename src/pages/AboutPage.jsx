import React, { useState } from "react";
import { Link } from "react-router-dom";
import Counter from "../components/Counter"; // Reusing our Counter component
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function AboutPage() {
  // State to manage the tabs, just like on the home page
  const [activeTab, setActiveTab] = useState("vision");

  const tabContent = (
    <div className="about-items">
      <div className="about-content">
        <p>
          Duise sagittis accumsan magna on adipiscine laoreet ultrices magna
          consectetuer eiaculis rutrum morbie habitasse orcids libero porttitor
          molestie mollise
        </p>
        <ul className="list-items">
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="14"
              viewBox="0 0 22 14"
              fill="none"
            >
              <path
                d="M11.3909 14C11.0558 14 10.8325 13.8667 10.6091 13.6L5.91878 8C5.47208 7.46667 5.47208 6.66667 5.91878 6.13333C6.36548 5.6 7.03553 5.6 7.48223 6.13333L11.3909 10.8L20.1015 0.4C20.5482 -0.133333 21.2183 -0.133333 21.665 0.4C22.1117 0.933333 22.1117 1.73333 21.665 2.26667L12.1726 13.6C12.0609 13.8667 11.7259 14 11.3909 14Z"
                fill="#EFFB53"
              />
              <path
                d="M5.80711 14C5.47208 14 5.24873 13.8667 5.02538 13.6L0.335025 8C-0.111675 7.46667 -0.111675 6.66667 0.335025 6.13333C0.781726 5.6 1.45178 5.6 1.89848 6.13333L6.58883 11.7333C7.03553 12.2667 7.03553 13.0667 6.58883 13.6C6.47716 13.8667 6.14213 14 5.80711 14ZM11.7259 7.06667C11.3909 7.06667 11.1675 6.93333 10.9442 6.66667C10.4975 6.13333 10.4975 5.33333 10.9442 4.8L14.5178 0.4C14.9645 -0.133333 15.6345 -0.133333 16.0812 0.4C16.5279 0.933333 16.5279 1.73333 16.0812 2.26667L12.5076 6.66667C12.2843 6.93333 12.0609 7.06667 11.7259 7.06667Z"
                fill="#EFFB53"
              />
            </svg>
            <span>Real-World Transformations</span>
          </li>
          {/* Other list items */}
        </ul>
        <Link to="/about" className="theme-btn">
          explore now <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
        </Link>
      </div>
      <div className="about-image">
        <img src="/assets/img/about/01.jpg" alt="img" />
      </div>
    </div>
  );

  return (
    <>
      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <h6 className="wow fadeInUp">
              <img src="/assets/img/star.png" alt="img" /> our story
            </h6>
            <h1 className="wow fadeInUp" data-wow-delay=".3s">
              About <span>Soshell</span>
            </h1>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="about-section style-padding section-padding fix">
        <div className="container">
          {/* ... Top part of about section with images and title ... */}
          <div className="about-wrapper mt-4">
            <ul className="nav">
              <li className="nav-item wow fadeInUp" data-wow-delay=".3s">
                <a
                  href="#Mission"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("mission");
                  }}
                  className={`nav-link ${
                    activeTab === "mission" ? "active" : ""
                  }`}
                >
                  Our Mission
                </a>
              </li>
              <li className="nav-item wow fadeInUp" data-wow-delay=".5s">
                <a
                  href="#Vision"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("vision");
                  }}
                  className={`nav-link ${
                    activeTab === "vision" ? "active" : ""
                  }`}
                >
                  Our Vision
                </a>
              </li>
              <li className="nav-item wow fadeInUp" data-wow-delay=".5s">
                <a
                  href="#Feature"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("feature");
                  }}
                  className={`nav-link ${
                    activeTab === "feature" ? "active" : ""
                  }`}
                >
                  Key Feature
                </a>
              </li>
            </ul>
            <div className="tab-content">
              {activeTab === "mission" && (
                <div className="tab-pane fade show active">{tabContent}</div>
              )}
              {activeTab === "vision" && (
                <div className="tab-pane fade show active">{tabContent}</div>
              )}
              {activeTab === "feature" && (
                <div className="tab-pane fade show active">{tabContent}</div>
              )}
            </div>
          </div>
        </div>
        <div className="brand-section section-padding pb-0">
          {/* ... Brand slider can be added here if needed ... */}
        </div>
      </section>

      {/* How To Work Section */}
      <section className="how-to-work-section fix section-padding section-bg">
        {/* ... JSX for How To Work section ... */}
      </section>

      {/* Counter Section */}
      <div className="counter-section section-padding pt-0">
        <div className="container">
          <div className="counter-wrapper">
            <Counter
              end={236}
              label="Finished Projects"
              iconSrc="/assets/img/icon/01.svg"
            />
            <Counter
              end={345}
              label="Happy Clients"
              iconSrc="/assets/img/icon/01.svg"
            />
            <Counter
              end={125}
              label="Expert Team"
              iconSrc="/assets/img/icon/01.svg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
