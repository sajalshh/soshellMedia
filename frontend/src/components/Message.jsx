import React from "react";

// 1. Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Message() {
  const brandLogos = [
    "/assets/img/brand/01.png",
    "/assets/img/brand/02.png",
    "/assets/img/brand/03.png",
    "/assets/img/brand/04.png",
    "/assets/img/brand/05.png",
    "/assets/img/brand/01.png", 
    "/assets/img/brand/02.png", 
    "/assets/img/brand/03.png", 
    "/assets/img/brand/04.png", 
    "/assets/img/brand/05.png" 
  ];

  return (
    <section className="message-section fix section-bg section-padding">
      <div className="bg-shape">
        <img src="/assets/img/about/bg-shape.png" alt="shape-img" />
      </div>
      <div className="container">
        <div className="message-items">
          <h2 className="wow fadeInUp query-msg" data-wow-delay=".3s">
            Have any query
            <span>
              {" "}
              send us <b>message</b>
            </span>
          </h2>
          <div className="circle-bg wow fadeInUp" data-wow-delay=".3s">
            <img src="/assets/img/circle-bg.png" alt="img" />
          </div>
          <div className="lets-talk-items wow fadeInUp" data-wow-delay=".5s">
            <a href="/contact" className="lets-circle">
              <i className="fa-sharp fa-regular fa-arrow-up-right"></i> <br />
              Let’s talk
            </a>
            <p>
              Duise sagittis accumsan magna on adipiscing laoreet ultrices magna
              consectetuer eiaculis rutrum morbie habitasse orci libero
              porttitor scelerisque acid vivamus molestie mollise
            </p>
          </div>
        </div>
      </div>
      <div className="brand-section section-padding pb-0">
        <div className="container">
          {/* 2. Replace the old div with the Swiper component */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            speed={2000}
            loop={true}
            centeredSlides={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              575: { slidesPerView: 2 },
              767: { slidesPerView: 3 },
              991: { slidesPerView: 4 },
              1200: { slidesPerView: 5 },
            }}
          >
            {brandLogos.map((logoSrc, index) => (
              <SwiperSlide key={index}>
                <div className="brand-image text-center">
                  <img src={logoSrc} alt={`brand-logo-${index + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
