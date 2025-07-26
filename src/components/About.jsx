import React, { useState } from "react";
import Counter from "./Counter"; // Make sure Counter.jsx is in the same folder
import { Fade } from "react-awesome-reveal"; // 1. Import the Fade component
import { Link } from "react-router-dom";

export default function About() {
  const [activeTab, setActiveTab] = useState("vision");

  // Reusable content for the tabs
  const tabContent = (
    <div className="about-items">
      <div className="about-content">
        <Fade direction="up" delay={300} triggerOnce>
          <p>
            Struggling with low visibility & poor conversions? Don’t quit evolve
            with Soshell Media.
          </p>
          <p>We Help You:</p>
          <ul>
            <li>
              <strong>Build Brand Awareness</strong> — stand out in a noisy
              market
            </li>
            <li>
              <strong>Spark Meaningful Conversations</strong> — engage & connect
              deeply
            </li>
            <li>
              <strong>3X Your Conversion Rate</strong> — with creative +
              strategic campaigns
            </li>
          </ul>
        </Fade>
        <Fade direction="up" delay={500} triggerOnce>
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
              <span className="our_mission_title">
                Your Growth Is Our Mission.
              </span>
            </li>
          </ul>
        </Fade>
        <Fade direction="up" delay={700} triggerOnce>
          <Link to="/about" className="theme-btn">
            explore now{" "}
            <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
          </Link>
        </Fade>
      </div>
      <Fade direction="up" delay={300} triggerOnce>
        <div className="about-image">
          <img src="/assets/img/about/01.jpg" alt="img" />
        </div>
      </Fade>
    </div>
  );

  return (
    <section className="about-section section-padding section-bg fix">
      <div className="bg-shape">
        <img src="/assets/img/about/bg-shape.png" alt="shape-img" />
      </div>
      <div className="color-bg">
        <img src="/assets/img/about/color-bg-shape.png" alt="img" />
      </div>
      <div className="color-bg-2">
        <img src="/assets/img/about/color-bg-shape-2.png" alt="img" />
      </div>
      <div className="container">
        <div className="section-title ml-200">
          <Fade direction="up" triggerOnce>
            <h6>
              <img src="/assets/img/star.png" alt="img" /> Who we are
            </h6>
          </Fade>
          <Fade direction="up" delay={300} triggerOnce>
            <h2>
              Explore the AI power <br />
              <span>
                & our <b>innovative</b> solutions
              </span>
            </h2>
          </Fade>
        </div>
        <div className="about-wrapper mt-4 mt-md-0">
          <ul className="nav">
            <Fade direction="up" delay={300} cascade damping={0.2} triggerOnce>
              <li className="nav-item">
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
              <li className="nav-item">
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
              <li className="nav-item">
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
            </Fade>
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
      <div className="counter-section section-padding pb-0">
        <div className="container">
          <div className="counter-wrapper">
            <Fade direction="up" delay={200} triggerOnce>
              <Counter
                end={1000}
                suffix="M+"
                label="Views Generated"
                iconSrc="/assets/img/icon/01.svg"
              />
            </Fade>
            <Fade direction="up" delay={400} triggerOnce>
              <Counter
                end={20}
                prefix="$"
                suffix="M"
                label="Revenue Driven (through our ad campaigns)"
                iconSrc="/assets/img/icon/01.svg"
              />
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <Counter
                end={100}
                suffix="+"
                label="Successful Campaigns Delivered"
                iconSrc="/assets/img/icon/01.svg"
              />
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
