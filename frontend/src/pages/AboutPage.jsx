import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaHandshake, FaVideo } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import Counter from "../components/Counter";
import SeoHelmet from "../components/SeoHelmet";

// Helper to map icon names from the database to actual components
const iconMap = {
  FaEye: FaEye,
  FaHandshake: FaHandshake,
  FaVideo: FaVideo,
};

export default function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutPageContent = async () => {
      try {
        // This URL must match the endpoint on your Node.js server
        const response = await axios.get(
          "http://localhost:3001/api/content/about",
        );
        setPageData(response.data);
      } catch (err) {
        console.error("Failed to fetch about page content:", err);
        setError("Could not load page content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPageContent();
  }, []); // The empty array ensures this effect runs only once when the component mounts

  // Render a loading state
  if (loading) {
    return <div className="section-padding text-center">Loading...</div>;
  }

  // Render an error state
  if (error) {
    return (
      <div className="section-padding text-center fs-4 text-danger">
        {error}
      </div>
    );
  }

  // Once data is loaded, render the full page
  return (
    <>
      <SeoHelmet pageUrl="/about" />
      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="section-title text-center mx-auto">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> Who we are
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                <span className="about">About </span>{" "}
                <b className="media-name">Soshell Media</b>
              </h2>
            </Fade>
          </div>
        </div>
      </div>

      {/* Custom Content Section */}
      <section className="about-section style-padding section-padding fix">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="about-content text-center">
                <Fade direction="up" triggerOnce>
                  {pageData.pageContent &&
                    pageData.pageContent.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className={`fs-5 ${index > 0 ? "mt-4" : ""}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                </Fade>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <div className="counter-section section-padding pb-0">
        <div className="container">
          <div className="counter-wrapper counter-one">
            {pageData.stats.map((stat) => (
              <Counter
                key={stat._id} // Using the database ID as the key
                end={stat.end}
                suffix={stat.suffix}
                label={stat.label}
                icon={iconMap[stat.icon]} // Dynamically select the icon
              />
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section className="team-section fix section-padding section-bg">
        <div className="container">
          <div className="section-title text-center mx-auto custom-section-title">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> dedicated member
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                The People Behind <br /> <span>the Purpose</span>
              </h2>
            </Fade>
          </div>
          <div className="row">
            {pageData.teamMembers.map((member, index) => (
              <div key={member._id} className="col-xl-3 col-lg-4 col-md-6">
                <Fade direction="up" delay={200 * (index + 1)} triggerOnce>
                  <div className="team-box-items">
                    <div className="team-image">
                      <img src={member.imgSrc} alt={member.name} />
                      {/* Social links can be added here later */}
                    </div>
                    <div className="team-content">
                      <h3>{member.name}</h3>
                      <p>{member.title}</p>
                    </div>
                  </div>
                </Fade>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
