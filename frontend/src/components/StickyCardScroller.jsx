import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import Card from "./Card";
import api from "../api/axiosConfig";


// Import Swiper for the mobile view
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// This is the DESKTOP component with the scroll animation
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 575);

  // 2. ADD EFFECT TO LISTEN FOR SCREEN RESIZING
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 575);
    };

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

      {/* 3. CONDITIONALLY RENDER BASED ON SCREEN SIZE */}
      {!loading && cardData.length > 0 ? (
        isMobile ? (
          // ON MOBILE: Render a Swiper Slider
          <div className="mobile-card-slider">
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
            >
              {cardData.map((card) => (
                <SwiperSlide key={card._id}>
                  {/* The Card component is reused here, but without animation styles */}
                  <Card card={card} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          // ON DESKTOP: Render the scrolling animation
          <ScrollingCards cardData={cardData} />
        )
      ) : (
        <div style={{ minHeight: "100vh" }}></div>
      )}
    </div>
  );
}
