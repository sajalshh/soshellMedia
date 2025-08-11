import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Fade } from "react-awesome-reveal";

// Data for the slider images
const showcaseImages = [
  "/assets/img/project/07.jpg",
  "/assets/img/project/07.jpg",
  "/assets/img/project/07.jpg",
  "/assets/img/project/07.jpg", 
  "/assets/img/project/07.jpg", 
];

export default function Showcase() {
  return (
    <section className="showcase-section fix section-padding-2 section-bg">
      <div className="container">
        <div className="section-title-area center-section">
          <div className="section-title ">
            <Fade direction="up" triggerOnce>
              <h2>
                The Videos <br />
                We're <b>Proud Of</b>
              </h2>
            </Fade>
          </div>
          <Fade direction="up" delay={300} triggerOnce>
            <p className="text-width subtitle-text">
              the stories we’ve brought to life for brands like yours
            </p>
          </Fade>
        </div>
      </div>
      <div className="container-fluid">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          speed={2000}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            575: { slidesPerView: 2 },
            991: { slidesPerView: 3 },
          }}
          className="showcase-slider"
        >
          {showcaseImages.map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <div className="showcase-items">
                <img src={imgSrc} alt={`showcase-item-${index + 1}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
