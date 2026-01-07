import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
  "/assets/img/brand/05.png",
];

export default function Message() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // --- Parallax Animations ---
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 20]); // Slow rotation on scroll
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]); // Slower scroll speed

  return (
    <section
      ref={sectionRef}
      className="message-section fix section-bg section-padding tw-overflow-hidden"
    >
      <div className="bg-shape">
        <img src="/assets/img/about/bg-shape.png" alt="shape-img" />
      </div>
      <div className="container">
        <div className="tw-relative tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-[500px]">
          {/* --- 1. Dynamic Parallax Background Circle --- */}
          <motion.div className="tw-absolute tw-z-0" style={{ y, rotate }}>
            <img src="/assets/img/circle-bg.png" alt="img" />
          </motion.div>

          {/* --- 2. Impactful Animated Heading --- */}
          <motion.h2
            className="tw-text-5xl md:tw-text-7xl tw-font-bold tw-text-center tw-z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {"Have any query ".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="tw-inline-block"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
            <span className="tw-block">
              {"send us ".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="tw-inline-block"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: (i + 3) * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
              <b className="tw-text-[var(--tp-theme-primary)]">
                {"message".split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    className="tw-inline-block"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: (i + 5) * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {word}
                  </motion.span>
                ))}
              </b>
            </span>
          </motion.h2>

          {/* --- 3. Interactive "Pulse" CTA --- */}
          <div className="tw-z-10 tw-mt-12 tw-text-center">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="tw-inline-block"
            >
              <Link
                to="/contact"
                className="tw-relative tw-w-40 tw-h-40 tw-rounded-full tw-bg-[var(--tp-theme-primary)] tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-black tw-font-bold tw-text-lg tw-shadow-lg"
              >
                {/* Pulse Animation */}
                <motion.div
                  className="tw-absolute tw-inset-0 tw-rounded-full tw-bg-[var(--tp-theme-primary)]"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="tw-relative">Let’s talk</span>
                <ArrowUpRight className="tw-relative" />
              </Link>
            </motion.div>
            <p className="tw-max-w-xl tw-mx-auto tw-mt-8 tw-text-[#CDCDCD]">
              Start with one recording. We handle the rest.
            </p>
          </div>
        </div>
      </div>

      {/* --- 4. Refined Brand Carousel --- */}
      {/* <div className="brand-section section-padding pb-0">
        <div className="container">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            speed={3000}
            loop={true}
            centeredSlides={true}
            autoplay={{ delay: 1, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 2 },
              575: { slidesPerView: 3 },
              767: { slidesPerView: 4 },
              991: { slidesPerView: 4 },
              1200: { slidesPerView: 5 },
            }}
          >
            {brandLogos.map((logoSrc, index) => (
              <SwiperSlide key={index}>
                <div className="brand-image tw-text-center">
                  <img
                    src={logoSrc}
                    alt={`brand-logo-${index + 1}`}
                    className="tw-filter tw-grayscale hover:tw-grayscale-0 tw-opacity-60 hover:tw-opacity-100 tw-transition-all tw-duration-300"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div> */}
    </section>
  );
}
