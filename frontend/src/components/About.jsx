import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axiosConfig";

export default function About() {
  const [activeTab, setActiveTab] = useState("");
  const [tabsData, setTabsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const tabsResponse = await api.get("/homepage/about-tabs");
        const tabs = tabsResponse.data.data || [];
        setTabsData(tabs);
        if (tabs.length > 0) {
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
        style={{ minHeight: "600px" }}
      />
    );
  }

  return (
    <section className="about-section section-padding section-bg fix">
      <div className="container">
        {/* ================= TOP HEADING (UNCHANGED) ================= */}
        <div className="section-title ml-200 text-center the-real">
          <Fade direction="up" triggerOnce>
            <h6>
              <img src="/assets/img/star.png" alt="img" />
              The Process
            </h6>
          </Fade>

          <Fade direction="up" delay={300} triggerOnce>
            <h2>
              <div className="the-real">
                Content Is Killing{" "}
                <span className="text-neon struggles">Your Consistency</span>
              </div>
              <div>
                Not Your <span className="text-neon">Ideas</span>
              </div>
            </h2>
          </Fade>
        </div>

        {/* ================= 3 COLUMN LAYOUT ================= */}
        <div className="tw-mt-20 tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-12 tw-items-start">
          {/* ================= COLUMN 1 – PROBLEM ================= */}
          <div>
            <h3 className="tw-text-2xl tw-font-bold tw-text-white">
              Creating Content Shouldn’t Be This Hard
            </h3>

            <p className="tw-mt-3 tw-text-gray-400">
              Founders struggle because:
            </p>

            <ul className="tw-mt-5 tw-space-y-3">
              {[
                "No time to shoot consistently",
                "Don’t know what to say on camera",
                "Posting feels random and exhausting",
                "Agencies demand too much involvement",
                "Content stops when business gets busy",
              ].map((item, index) => (
                <li
                  key={index}
                  className="tw-flex tw-items-start tw-gap-3 tw-text-gray-300"
                >
                  <SVGIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= COLUMN 2 – PROCESS BUTTONS ================= */}
          <div className="tw-flex tw-flex-col tw-gap-4">
            {tabsData.map((tab) => (
              <button
                key={tab.tabId}
                onClick={() => setActiveTab(tab.tabId)}
                className={`tw-w-full tw-py-4 tw-rounded-full tw-font-semibold tw-transition-all tw-duration-300 tw-border ${
                  activeTab === tab.tabId
                    ? "tw-bg-[var(--tp-theme-primary)] tw-text-black tw-border-transparent tw-shadow-lg"
                    : "tw-bg-[#1D1D21] tw-text-white tw-border-white/20 hover:tw-bg-gray-800"
                }`}
              >
                {tab.tabTitle}
              </button>
            ))}
          </div>

          {/* ================= COLUMN 3 – CONTENT ================= */}
          <div className="tw-flex tw-flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTabData && (
                  <div>
                    <h3 className="tw-text-xl tw-font-bold tw-text-white">
                      {activeTabData.heading}
                    </h3>

                    <p className="tw-mt-3 tw-text-gray-400">
                      {activeTabData.paragraph}
                    </p>

                    <ul className="tw-mt-5 tw-space-y-3">
                      {activeTabData.listItems.map((item, index) => (
                        <li
                          key={index}
                          className="tw-flex tw-items-start tw-gap-3 tw-text-gray-300"
                        >
                          <SVGIcon />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="tw-mt-8">
              <Link to="/project" className="theme-btn">
                What Our Clients Say?
                <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CHECK ICON ================= */
const SVGIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="14"
    viewBox="0 0 22 14"
    fill="none"
    className="tw-mt-1 tw-flex-shrink-0"
  >
    <path
      d="M11.3909 14C11.0558 14 10.8325 13.8667 10.6091 13.6L5.91878 8C5.47208 7.46667 5.47208 6.66667 5.91878 6.13333C6.36548 5.6 7.03553 5.6 7.48223 6.13333L11.3909 10.8L20.1015 0.4C20.5482 -0.133333 21.2183 -0.133333 21.665 0.4C22.1117 0.933333 22.1117 1.73333 21.665 2.26667L12.1726 13.6C12.0609 13.8667 11.7259 14 11.3909 14Z"
      fill="#EFFB53"
    />
  </svg>
);
