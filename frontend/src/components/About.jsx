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
        const res = await api.get("/homepage/about-tabs");
        const tabs = res.data.data || [];
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
        {/* ================= TOP TITLE ================= */}
        <div className="section-title ml-200 text-center the-real">
          <Fade direction="up" triggerOnce></Fade>

          <Fade direction="up" delay={300} triggerOnce>
            <h2>
              <div className="the-real">
                Clone
                <span className="text-neon struggles"> Yourself. </span>
                Be Where <span className="text-neon struggles"> you</span>{" "}
                Matter.
              </div>
              <div>
                <span className="text-neon">Automate</span> The Rest
              </div>
            </h2>
          </Fade>
        </div>

        {/* ================= TWO COLUMN GRID ================= */}
        <div className="tw-mt-10 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-20 tw-items-start">
          {/* ================= COLUMN 1 ================= */}
          <div>
            <h3 className="tw-text-3xl tw-font-bold tw-text-white">
              Creating Content Shouldn’t Be This Hard
            </h3>

            <p className="tw-mt-2 tw-text-gray-400">
              Founders struggle because:
            </p>

            <div className="problem-box tw-mt-6">
              <ul className="tw-space-y-3 tw-text-white">
                {[
                  "No time to shoot consistently",
                  "Don’t know what to say on camera",
                  "Agencies demand too much involvement",
                  "Content stops when business gets busy",
                  "Leads go cold because you're too busy to follow up",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="tw-flex tw-items-start tw-gap-3 tw-text-gray-300"
                  >
                    <SVGIcon2 />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ================= COLUMN 2 ================= */}
          <div>
            <h3 className="tw-text-3xl tw-font-bold tw-text-white">
              Create More With Less Efforts
            </h3>

            <p className="tw-mt-2 tw-text-gray-400">
              Stay visible everywhere without constant effort
            </p>

            {/* ✅ FIXED BUTTON ROW (NO SLIDER) */}
            <div className="tw-mt-4 tw-flex tw-gap-3 tw-flex-wrap">
              {tabsData.map((tab) => (
                <button
                  key={tab.tabId}
                  onClick={() => setActiveTab(tab.tabId)}
                  className={`tw-px-4 tw-py-2 sm:tw-px-6 sm:tw-py-3 tw-rounded-full tw-text-sm sm:tw-text-base tw-font-semibold tw-border tw-transition-all tw-duration-300 ${
                    activeTab === tab.tabId
                      ? "tw-bg-[var(--tp-theme-primary)] tw-text-black tw-border-transparent tw-shadow-lg"
                      : "tw-bg-[#1D1D21] tw-text-white tw-border-white/20 hover:tw-bg-gray-800"
                  }`}
                >
                  {tab.tabTitle}
                </button>
              ))}
            </div>

            {/* ================= CONTENT ================= */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="tw-mt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTabData && (
                  <div>
                    <h4 className="tw-text-xl tw-font-bold tw-text-white">
                      {activeTabData.heading}
                    </h4>

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
          </div>
        </div>

        {/* ================= CTA ================= */}
        <div className="tw-mt-16 tw-flex tw-justify-center">
          <Link to="/project" className="theme-btn">
            Watch client Reviews
            <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= ICONS ================= */

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

const SVGIcon2 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="tw-mt-1 tw-flex-shrink-0"
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="#FF4D4F"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
