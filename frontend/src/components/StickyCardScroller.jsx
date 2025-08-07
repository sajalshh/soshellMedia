import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import Card from "./Card";
import api from "../api/axiosConfig";

// 1. Create a new child component for the scrolling content
const ScrollingCards = ({ cardData }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalCards = cardData.length;

  return (
    <div ref={containerRef} className="sticky-scroll-container">
      <div className="sticky-card-pinner">
        {cardData.map((card, index) => {
          const start = index / totalCards;
          const end = (index + 1) / totalCards;

          const y = useTransform(
            scrollYProgress,
            [start, end],
            ["0%", index === totalCards - 1 ? "0%" : "-100%"],
          );

          const scale = useTransform(
            scrollYProgress,
            [start, end],
            [1, index === totalCards - 1 ? 1 : 0.9],
          );

          return (
            <Card
              key={card._id}
              card={card}
              style={{
                y,
                scale,
                zIndex: totalCards - index,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// 2. The main component now only handles data fetching and loading states
export default function StickyCardScroller() {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceCards = async () => {
      try {
        const response = await api.get("/homepage/service-cards");
        setCardData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch service cards:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceCards();
  }, []);

  return (
    <div className="sticky-scroll-wrapper">
      {/* Static heading block */}
      <div className="section-title text-center">
        <h6 className="wow fadeInUp">
          <img src="/assets/img/star.png" alt="img" />
          Our Services
        </h6>
        <h2 className="wow fadeInUp" data-wow-delay=".3s">
          We Don’t <b>Build</b> Hype. <br />
          <strong className="we-build">
            We Build <b>Lasting</b> Brands.
          </strong>
        </h2>
      </div>

      {/* 3. Conditionally render the new component only when data is ready */}
      {!loading && cardData.length > 0 ? (
        <ScrollingCards cardData={cardData} />
      ) : (
        // You can have a more sophisticated loader here if you want
        <div style={{ minHeight: "100vh" }}></div>
      )}
    </div>
  );
}
