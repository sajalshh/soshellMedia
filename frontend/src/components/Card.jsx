import React from "react";
import { motion } from "framer-motion";

export default function Card({ card, style }) {
  // Intercept Cloudinary URLs to enforce WebP/AVIF format, auto-quality, and a max width of 800px
  const optimizedImageUrl =
    card.image && card.image.includes("/image/upload/")
      ? card.image.replace(
          "/image/upload/",
          "/image/upload/f_auto,q_auto,w_800/",
        )
      : card.image;

  return (
    <motion.div className="sticky-card" style={style}>
      <div className="card-inner">
        {/* LEFT: Image with floating box */}
        <div className="card-image-container">
          {/* CRITICAL FIX: Use the optimized URL and defer loading */}
          <img
            src={optimizedImageUrl}
            alt={card.title || "visual"}
            loading="lazy"
            decoding="async"
            className="card-image"
          />

          {/*
            <div className="floating-box">
              <div className="icon">⏱</div>
              <div>
                <div className="floating-time">{card.floatingTitle}</div>
                <div className="floating-sub">{card.floatingSub}</div>
              </div>
            </div> 
          */}
        </div>

        {/* RIGHT: Text content */}
        <div className="card-text">
          <h2>{card.title}</h2>
          {Array.isArray(card.description) ? (
            <ul className="card-bullets">
              {card.description.map((item, idx) => (
                <li key={idx}>{item.text}</li>
              ))}
            </ul>
          ) : (
            <p>{card.description}</p>
          )}
          <a href="/Service" className="explore-button">
            Explore More
          </a>
        </div>
      </div>
    </motion.div>
  );
}
