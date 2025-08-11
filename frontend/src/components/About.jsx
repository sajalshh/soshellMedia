import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

export default function About() {
  const [activeTab, setActiveTab] = useState("");
  const [tabsData, setTabsData] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        
        const [tabsResponse, sectionResponse] = await Promise.all([
          api.get("/homepage/about-tabs"),
          api.get("/homepage/about-section"),
        ]);

        const tabs = tabsResponse.data.data;
        setTabsData(tabs);

        
        if (sectionResponse.data.data) {
          setVideoUrl(sectionResponse.data.data.videoUrl);
        }

      
        if (tabs && tabs.length > 0) {
          setActiveTab(tabs[0].tabId);
        }
      } catch (error) {
        console.error("Failed to fetch about content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutContent();
  }, []);

  const activeTabData = tabsData.find((tab) => tab.tabId === activeTab);

  if (loading) {
    return (
      <section
        className="about-section section-padding section-bg fix"
        style={{ minHeight: "800px" }}
      ></section>
    );
  }

  return (
    <section className="about-section section-padding section-bg fix ">
      <div className="container">
        <div className="section-title ml-200 text-center the-real">
          <Fade direction="up" triggerOnce>
            <h6>
              <img src="/assets/img/star.png" alt="img" /> We Understand
            </h6>
          </Fade>
          <Fade direction="up" delay={300} triggerOnce>
            <h2>
              <div className="the-real">
                The Real <span className="text-neon struggles">Struggles</span>
              </div>
              <div>
                You <span className="text-neon">Face</span>
              </div>
            </h2>
          </Fade>
        </div>

        <div className="about-wrapper mt-4 mt-md-0">
          <ul className="nav">
            <Fade direction="up" delay={300} cascade damping={0.2} triggerOnce>
              {tabsData.map((tab) => (
                <li className="nav-item" key={tab.tabId}>
                  <a
                    href={`#${tab.tabId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab.tabId);
                    }}
                    className={`nav-link ${
                      activeTab === tab.tabId ? "active" : ""
                    }`}
                  >
                    {tab.tabTitle}
                  </a>
                </li>
              ))}
            </Fade>
          </ul>

          <div className="tab-content">
            {activeTabData && (
              <div className="tab-pane active">
                <div className="about-items">
                  <div className="about-content">
                    <Fade direction="up" delay={300} triggerOnce>
                      <h3 className="what-to-post">{activeTabData.heading}</h3>
                      <p>{activeTabData.paragraph}</p>
                    </Fade>
                    <Fade direction="up" delay={500} triggerOnce>
                      <ul className="list-items">
                        {activeTabData.listItems.map((item, index) => (
                          <li key={index}>
                            <SVGIcon />
                            <span className="content-ideas-pointers">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Fade>
                    <Fade direction="up" delay={700} triggerOnce>
                      <Link to="/project" className="theme-btn about-button">
                        What Our clients say?{" "}
                        <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                      </Link>
                    </Fade>
                  </div>

                  {/* The old image div is replaced with this new video container */}
                  <Fade direction="up" delay={300} triggerOnce>
                    <div className="about-video-container">
                      {videoUrl && (
                        <iframe
                          src={`${videoUrl}?autoplay=1&loop=1&mute=1&playsinline=1&controlsVisibleOnLoad=false&videoFoam=true`}
                          title="About Us Video"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          frameBorder="0"
                          scrolling="no"
                          className="wistia_embed"
                          name="wistia_embed"
                        ></iframe>
                      )}
                    </div>
                  </Fade>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const SVGIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="14"
    viewBox="0 0 22 14"
    fill="none"
    style={{ flexShrink: 0 }}
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
);
