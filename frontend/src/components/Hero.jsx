import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/legacy.css";
import Counter1 from "../components/counter1";

const parseNeonText = (text) => {
  if (!text) return "";
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
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const toggleAudio = () => {
    if (playerRef.current) {
      playerRef.current.muted = !playerRef.current.muted;
    }
  };

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await api.get("/homepage/hero");
        setContent(response.data.data);
      } catch (error) {
        console.error("Failed to fetch hero content:", error);
        setContent({
          headingLine1: "You *Grow* Your Business",
          headingLine2: "Your *AI Twin* Handles The *Content*",
          subheading:
            "We’ll create your AI twin & handle video production end-to-end from script to fully edited videos",
          buttonText: "Build My AI Twin",
          buttonLink: "/appointment",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHeroContent();
  }, []);

  useEffect(() => {
    if (!content?.videoUrl) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = content.videoUrl;
    link.type = "video/mp4";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [content?.videoUrl]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const minScale = 0.85;
      const maxScale = 1;
      const scrollRange = 400;

      const newScale = Math.min(
        maxScale,
        Math.max(
          minScale,
          minScale + (scrollTop / scrollRange) * (maxScale - minScale),
        ),
      );
      setScale(newScale);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <section className="hero-secton hero-1" style={{ minHeight: "100vh" }} />
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
            <div className="hero-content hero-glow-wrapper">
              {/* ===== UPDATED HEADING ===== */}
              {/* Removed 'wow' and 'img-custom-anim-left' classes */}
              <h1
                className="hero-heading"
                style={{ pointerEvents: "none" }} // Prevents mouse hover detection
              >
                <span className="hero-line hero-line-1">
                  {parseNeonText(content.headingLine1)}
                </span>

                <span className="hero-line hero-line-2">
                  {parseNeonText(content.headingLine2)}
                </span>
              </h1>
              {/* =========================== */}

              <p className="sub">{content.subheading}</p>

              <div className="hero-button">
                <Link
                  to={content.buttonLink}
                  className="theme-btn hero-contact-btn"
                >
                  {content.buttonText}
                  <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Counter1 />

      <div
        className="hero-video-bg"
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.2s ease-out",
          transformOrigin: "center center",
          marginTop: "10px",
        }}
      >
        {content?.videoUrl && (
          <video
            ref={playerRef}
            onClick={toggleAudio}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/assets/img/hero/hero-bg-3.png"
            onCanPlayThrough={() => setVideoReady(true)}
            style={{
              objectFit: "cover",
              display: "block",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <source src={content.videoUrl} type="video/mp4" />
          </video>
        )}
      </div>
    </section>
  );
}
