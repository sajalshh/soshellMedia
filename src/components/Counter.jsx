import React, { useState, useEffect, useRef } from "react";

// The signature now includes prefix and suffix, with default empty values
export default function Counter({
  end = 0,
  duration = 2000,
  label,
  iconSrc,
  displayText,
  prefix = "",
  suffix = "",
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (displayText) return;

    if (isInView) {
      let start = 0;
      const endValue = parseInt(end) || 0;
      if (start === endValue) return;

      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * endValue);
        setCount(current);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration, displayText]);

  return (
    <div className="counter-items wow fadeInUp" ref={ref}>
      <div className="icon">
        <img src={iconSrc} alt="icon" />
      </div>
      <div className="content">
        {/* The h2 now renders the prefix, animated count, and suffix */}
        <h2>
          {displayText
            ? displayText
            : `${prefix}${count.toLocaleString()}${suffix}`}
        </h2>
        <p>{label}</p>
      </div>
    </div>
  );
}

// Custom hook to detect if an element is in the viewport
function useInView(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isIntersecting;
}
