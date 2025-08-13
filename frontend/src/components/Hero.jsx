
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig"; 
import '../styles/legacy.css';

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
  const videoRef = useRef(null);
  const [scale, setScale] = useState(1);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);


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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const minScale = 1;
      const maxScale = 1.12;
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
        className="hero-video-bg"
        ref={videoRef}
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.2s ease-out",
          transformOrigin: "center center",
        }}
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
          width="80%"
          height="100%"
        ></iframe>
      </div>
    </section>
  );
}
