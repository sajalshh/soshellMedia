// src/components/Hero.jsx

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig"; // Using the public api instance

// 1. Helper function to parse text with asterisks for neon styling
const parseNeonText = (text) => {
  if (!text) return "";
  // This splits the text by asterisks and wraps every second element in a span
  return text.split("*").map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="text-neon">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default function Hero() {
  const videoRef = useRef(null);
  const [isScaled, setIsScaled] = useState(false);

  // 2. State for holding dynamic content and loading status
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Fetch data when the component mounts
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await api.get("/homepage/hero");
        setContent(response.data.data);
      } catch (error) {
        console.error("Failed to fetch hero content:", error);
        // You can set a default content object here in case of an error
        setContent({
          headingLine1: "We *Don't* Just *Post*",
          headingLine2: "We Create *Content*",
          headingLine3: "That *Converts*",
          subheading:
            "Performance-driven content studio for bold brands ready to scale, not settle",
          buttonText: "Book a discovery call",
          buttonLink: "/contact",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHeroContent();
  }, []);

  useEffect(() => {
    // This is your existing Intersection Observer logic, it remains unchanged
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsScaled(true);
        else setIsScaled(false);
      },
      { threshold: 0.5 },
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  // Display a loading state while fetching data
  if (loading) {
    return (
      <section
        className="hero-secton hero-1"
        style={{ minHeight: "100vh" }}
      ></section>
    );
  }

  return (
    <section
      className="hero-secton hero-1 bg-cover"
      style={{ backgroundImage: "url('/assets/img/hero/hero-bg-3.png')" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero-content">
              <div className="color-bg">
                <img src="/assets/img/hero/color-bg.png" alt="img" />
              </div>
              {/* 4. Use the dynamic content */}
              <h1
                className="wow img-custom-anim-left"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                {parseNeonText(content.headingLine1)} <br />
                <span className="text-2">
                  {parseNeonText(content.headingLine2)}
                </span>
                <span className="text-2">
                  {" "}
                  {parseNeonText(content.headingLine3)}
                </span>
              </h1>
              <p className="sub">{content.subheading}</p>
              <div className="hero-button">
                <Link
                  to={content.buttonLink}
                  className="theme-btn hero-contact-btn"
                >
                  {content.buttonText}{" "}
                  <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`hero-video-bg ${isScaled ? "scaled" : ""}`}
        ref={videoRef}
      >
        <iframe
          src="https://fast.wistia.net/embed/iframe/djiv5ywnyy?autoplay=1&loop=1&mute=1&playsinline=1&controlsVisibleOnLoad=false&videoFoam=true"
          title="Hero background video"
          allow="autoplay; fullscreen"
          allowtransparency="true"
          frameBorder="0"
          scrolling="no"
          className="wistia_embed"
          name="wistia_embed"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </section>
  );
}
