import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/legacy.css";
import Counter1 from "../components/counter1";

/* ---------- Helper ---------- */
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

  /* ---------- AI Call Modal State ---------- */
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [callSuccess, setCallSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const toggleAudio = () => {
    if (playerRef.current) {
      playerRef.current.muted = !playerRef.current.muted;
    }
  };

  /* ---------- Fetch Hero Content ---------- */
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

  /* ---------- UPDATED: Preload Video (Desktop Only) ---------- */
  useEffect(() => {
    if (!content?.videoUrl) return;

    // Only aggressively preload the video if the user is on a desktop/tablet
    // Mobile users will save their bandwidth for critical CSS/JS first.
    if (window.innerWidth > 768) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = content.videoUrl;
      link.type = "video/mp4";
      document.head.appendChild(link);

      return () => document.head.removeChild(link);
    }
  }, [content?.videoUrl]);

  /* ---------- Scroll Scale Effect ---------- */
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

  /* ---------- AI Call Submit ---------- */
  const handleAiCallSubmit = async (e) => {
    e.preventDefault();
    setCallLoading(true);

    try {
      await api.post("/ai-call/trigger", formData);
      setCallSuccess(true);

      setTimeout(() => {
        setIsAiModalOpen(false);
        setCallSuccess(false);
        setFormData({ name: "", email: "", phone: "" });
      }, 3000);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setCallLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="hero-secton hero-1" style={{ minHeight: "100vh" }} />
    );
  }

  return (
    <>
      {/* ================= HERO ================= */}
      <section
        className="hero-secton hero-1 bg-cover"
        // UPDATED: Assuming you will convert this background image to WebP too!
        style={{ backgroundImage: "url('/assets/img/hero/hero-bg-3.webp')" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="hero-content hero-glow-wrapper">
                <h1 className="hero-heading" style={{ pointerEvents: "none" }}>
                  <span className="hero-line hero-line-1">
                    {parseNeonText(content.headingLine1)}
                  </span>
                  <span className="hero-line hero-line-2">
                    {parseNeonText(content.headingLine2)}
                  </span>
                </h1>

                <p className="sub">{content.subheading}</p>

                {/* ---------- BUTTONS ---------- */}
                <div className="hero-button tw-flex tw-gap-4 tw-flex-wrap">
                  <Link
                    to={content.buttonLink}
                    className="theme-btn hero-contact-btn"
                  >
                    {content.buttonText}
                    <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                  </Link>

                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="theme-btn hero-contact-btn hero-secondary-btn"
                  >
                    Test 24/7 AI Assistant
                    <i className="fa-sharp fa-regular fa-phone tw-ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Counter1 />

        {/* ---------- VIDEO ---------- */}
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
              // UPDATED: "metadata" prevents downloading the whole video before the page loads
              preload="metadata"
              // UPDATED: Changed .png to .webp for a massive speed boost on the initial load
              poster="/assets/img/hero/hero-bg-3.webp"
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

      {/* ================= AI CALL MODAL ================= */}
      {isAiModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAiModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 className="modal-title tw-text-white">
                Test Call Simulation
              </h4>
              <button
                className="modal-close-btn"
                onClick={() => setIsAiModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              {!callSuccess ? (
                <form onSubmit={handleAiCallSubmit} className="booking-form">
                  <p className="tw-text-gray-400 tw-text-center tw-mb-4">
                    Enter your details. Our AI will call you instantly.
                  </p>

                  <div className="form-group">
                    <label>Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="theme-btn tw-w-full"
                    disabled={callLoading}
                  >
                    {callLoading ? "Connecting..." : "Call Me Now"}
                  </button>
                </form>
              ) : (
                <div className="tw-text-center tw-py-8">
                  <h3 className="tw-text-white tw-text-2xl tw-font-bold">
                    Calling You...
                  </h3>
                  <p className="tw-text-gray-400">Pick up your phone! 📞</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
