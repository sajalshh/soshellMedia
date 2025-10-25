import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import api from "../api/axiosConfig";
import { Fade } from "react-awesome-reveal"; // Import the Fade component

export default function Showcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get("/portfolio");
        let fetchedProjects = response.data.data;

        if (fetchedProjects.length > 0 && fetchedProjects.length < 10) {
          const originalProjects = [...fetchedProjects];
          while (fetchedProjects.length < 10) {
            fetchedProjects = [...fetchedProjects, ...originalProjects];
          }
        }

        setProjects(fetchedProjects.slice(0, 10));
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
      {/* --- CHANGE: Added the consistent header text section --- */}
      <div className="container">
        <div className="section-title text-center mx-auto">
          <Fade direction="up" triggerOnce>
            <h6>
              <img src="/assets/img/star.png" alt="img" /> Trusted by the Best
            </h6>
          </Fade>
          <Fade direction="up" delay={200} triggerOnce>
            <h2>
              Global Clients who <b>trusts us</b>
            </h2>
          </Fade>
        </div>
      </div>

      <div className="container-fluid mt-5">
        {!loading && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            speed={3000} // Slightly slower for a smoother feel
            loop={true}
            autoplay={{
              delay: 1, // Use 1 for a continuous, seamless scroll
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              575: { slidesPerView: 2 },
              991: { slidesPerView: 3 },
              1200: { slidesPerView: 6 },
            }}
            className="showcase-slider"
          >
            {projects.map((project, index) => (
              <SwiperSlide key={`${project._id}-${index}`}>
                <div className="showcase-items">
                  <div className="portfolio-video-wrapper">
                    <iframe
                      src={`${project.videoUrl}?autoplay=1&loop=1&mute=1&playsinline=1&controls=0`}
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
