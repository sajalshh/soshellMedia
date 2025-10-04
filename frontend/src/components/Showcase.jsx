// src/components/Showcase.jsx

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import api from "../api/axiosConfig";

export default function Showcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get("/portfolio");
        setProjects(response.data.data);
      } catch (error) {
        console.error("Failed to fetch projects for showcase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="showcase-section fix section-padding-2 section-bg">
      <div className="container"></div>
      <div className="container-fluid">
        {!loading && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            speed={2000}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            // --- CHANGE IS HERE ---
            breakpoints={{
              0: { slidesPerView: 1 },
              575: { slidesPerView: 2 },
              991: { slidesPerView: 3 },
              1200: { slidesPerView: 4 }, // Show 4 slides on screens 1200px and wider
            }}
            className="showcase-slider"
          >
            {projects.map((project) => (
              <SwiperSlide key={project._id}>
                <div className="showcase-items">
                  <div className="portfolio-video-wrapper">
                    <iframe
                      src={`${project.videoUrl}?autoplay=1&loop=1&mute=1&playsinline=1&controlsVisibleOnLoad=false&videoFoam=true`}
                      title={project.title}
                      allow="autoplay; fullscreen"
                      frameBorder="0"
                      scrolling="no"
                      className="wistia_embed"
                    ></iframe>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
