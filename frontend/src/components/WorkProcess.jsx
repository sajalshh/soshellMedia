import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import api from "../api/axiosConfig";

// This component remains the same
const ProcessStep = ({ imageUrl, title, description, scale, borderColor }) => (
  <div className="tw-text-center tw-flex tw-flex-col tw-items-center">
    <motion.div
      className="tw-relative tw-mb-6 tw-w-32 tw-h-32 tw-rounded-full tw-bg-[#151518] tw-flex tw-items-center tw-justify-center tw-border-4 tw-overflow-hidden"
      style={{ scale, borderColor }}
    >
      <img
        src={imageUrl}
        alt={title}
        className="tw-w-full tw-h-full tw-object-cover"
      />
    </motion.div>
    <div className="tw-bg-[#151518] tw-relative tw-p-2">
      <h3 className="tw-text-xl tw-font-bold tw-text-white mb-2">{title}</h3>
      <p className="tw-text-[#CDCDCD] tw-text-sm">{description}</p>
    </div>
  </div>
);

// --- CHANGE 1: Create a new component for the animated content ---
// This component will only render when data is ready.
const AnimatedWorkProcess = ({ processData }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // All the animation logic is now safely inside this component
  const pathLength = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const themeColor = "var(--tp-theme-primary)";
  const inactiveColor = "rgba(207, 208, 212, 0.1)";
  const activationPoints = [0.01, 0.2, 0.4, 0.6, 0.8];

  const animations = processData.map((_, index) => {
    const start = activationPoints[index];
    const end = start + 0.1;
    return {
      borderColor: useTransform(
        pathLength,
        [start - 0.01, start],
        [inactiveColor, themeColor],
      ),
      scale: useTransform(pathLength, [start - 0.01, start, end], [1, 1.1, 1]),
    };
  });

  if (animations.length > 0) {
    animations[0].borderColor = useTransform(
      pathLength,
      [0, 0.01],
      [themeColor, themeColor],
    );
    animations[0].scale = useTransform(
      pathLength,
      [0, 0.01, 0.1],
      [1.1, 1.1, 1],
    );
  }

  return (
    <section
      ref={targetRef} // The ref is now guaranteed to exist when this renders
      className="work-process-section fix section-padding-2 bg-cover"
      style={{ backgroundImage: "url('assets/img/work-process-bg.jpg')" }}
    >
      <div className="container">
        <div className="section-title text-center">
          <img src="/assets/img/title-icon.png" alt="img" className="mb-3" />
          <h2 className="mb-3">
            Watch Your <b>Brand</b> Scale
          </h2>
          <p>Stories That Move Your Audience</p>
        </div>

        <div className="tw-relative tw-mt-24 tw-min-h-[400px]">
          {/* SVG paths remain the same */}
          <svg
            className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-hidden lg:tw-block tw-z-0"
            viewBox="0 0 1200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 120 100 C 240 0, 240 0, 360 100 C 480 200, 480 200, 600 100 C 720 0, 720 0, 840 100 C 960 200, 960 200, 1080 100"
              stroke="rgba(207, 208, 212, 0.1)"
              strokeWidth="4"
            />
            <motion.path
              d="M 120 100 C 240 0, 240 0, 360 100 C 480 200, 480 200, 600 100 C 720 0, 720 0, 840 100 C 960 200, 960 200, 1080 100"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient
                id="gradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="1200"
                y2="0"
              >
                <stop stopColor={themeColor} stopOpacity="0" />
                <stop stopColor={themeColor} />
              </linearGradient>
            </defs>
          </svg>
          <svg
            className="tw-absolute tw-top-0 tw-left-1/2 -tw-translate-x-1/2 tw-h-full tw-w-1 lg:tw-hidden tw-z-0"
            width="4"
            height="100%"
            viewBox="0 0 4 1800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M 2 0 V 1800"
              stroke="rgba(207, 208, 212, 0.1)"
              strokeWidth="4"
            />
            <motion.path
              d="M 2 0 V 1800"
              stroke="url(#mobile-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient
                id="mobile-gradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2="1800"
              >
                <stop stopColor={themeColor} stopOpacity="0" />
                <stop offset="0.9" stopColor={themeColor} />
              </linearGradient>
            </defs>
          </svg>

          <div className="tw-relative tw-z-10 tw-grid tw-grid-cols-1 md:tw-grid-cols-3 lg:tw-grid-cols-5 tw-gap-y-24 lg:tw-gap-y-0">
            {processData.map((item, index) => (
              <div
                key={item._id}
                className={`tw-flex tw-flex-col tw-items-center lg:${
                  index % 2 !== 0
                    ? "tw-translate-y-[100px]"
                    : "-tw-translate-y-[32px]"
                }`}
              >
                <ProcessStep
                  imageUrl={item.image}
                  title={item.title}
                  description={item.description}
                  {...animations[index]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- CHANGE 2: The main export component now ONLY handles data fetching and loading states ---
export default function WorkProcess() {
  const [processData, setProcessData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await api.get("/work-process");
        setProcessData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch work process steps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, []);

  if (loading) {
    return (
      <section
        className="work-process-section fix section-padding-2 bg-cover"
        style={{ minHeight: "500px" }}
      ></section>
    );
  }

  // Once loading is false, render the animated component with the fetched data
  return <AnimatedWorkProcess processData={processData} />;
}
