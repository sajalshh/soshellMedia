import React from "react";
import { motion } from "framer-motion";

export default function Card({ card, style }) {
  return (
    <motion.div className="sticky-card" style={style}>
      <div className="card-inner">
        {/* LEFT: Image with floating box */}
        <div className="card-image-container">
          <img src={card.image} alt="visual" className="card-image" />

          {/* The entire floating box below is wrapped in comments and has not been removed. */}
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
          <a href="/project" className="explore-button">
            Explore More
          </a>{" "}
          {/* Replace link */}
        </div>
      </div>
    </motion.div>
  );
}
