import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/legacy.css";

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
  // Ref for the container (parallax effect)
  const containerRef = useRef(null);
  // Ref specifically for the video player (to control audio)
  const playerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to toggle audio on click
  const toggleAudio = () => {
    if (playerRef.current) {
      // If muted, unmute it. If unmuted, mute it.
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
          headingLine1: "We *Don't* Just *Post*",
          headingLine2: "We Create *Content*",
          headingLine3: "That *Converts*",
          subheading:
            "Performance-driven content studio for bold brands ready to scale, not settle",
          buttonText: "Book a discovery call",
          buttonLink: "/appointment",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHeroContent();
  }, []);

  // Parallax Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const minScale = 0.8;
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

              <h1
                className="wow img-custom-anim-left"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                <span className="hero-line-1">
                  {parseNeonText(content.headingLine1)}
                </span>
                <br />
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

      {/* BACKGROUND VIDEO CONTAINER */}
      <div
        className="hero-video-bg"
        ref={containerRef}
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.2s ease-out",
          transformOrigin: "center center",
          // Removed overflow: hidden to allow shadows/glows if you have them
        }}
      >
        {content?.videoUrl ? (
          <video
            ref={playerRef}
            onClick={toggleAudio}
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/img/hero/hero-bg-3.png"
            // 👇 UPDATED STYLES: Removed "absolute", "top", "left", "100% width"
            // Now it relies on your legacy.css to set the width to 940px
            style={{
              objectFit: "cover",
              display: "block",
              zIndex: 0,
              // If you need to force the size in JS (optional, but CSS is better):
              // maxWidth: "940px",
              // width: "100%",
              // borderRadius: "12px"
            }}
          >
            <source src={content.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Fallback to Wistia
          <iframe
            src="https://fast.wistia.net/embed/iframe/djiv5ywnyy?autoplay=1&loop=1&mute=1&playsinline=1&controlsVisibleOnLoad=false&videoFoam=true"
            title="Hero background video"
            allow="autoplay; fullscreen"
            allowtransparency="true"
            frameBorder="0"
            scrolling="no"
            className="wistia_embed"
            name="wistia_embed"
            width="80%"
            height="100%"
          ></iframe>
        )}
      </div>
    </section>
  );
}
