import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import api from "../api/axiosConfig";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

export default function Showcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await api.get("/showcase");
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
      <div className="container">
        <div className="section-title text-center mx-auto">
          <Fade direction="up" triggerOnce></Fade>
          <Fade direction="up" delay={200} triggerOnce>
            <h2>
              Global Clients who <b>trust us</b>
            </h2>
          </Fade>
        </div>
      </div>

      <div className="container-fluid mt-5">
        {!loading && (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            speed={3000}
            loop={true}
            autoplay={{
              delay: 1,
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
                  <div className="portfolio-video-wrapper glow-teal-border">
                    <video
                      src={project.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-100"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                        pointerEvents: "none",
                        borderRadius: "16px",
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Button Center Bottom */}
        <div className="tw-flex tw-justify-center tw-mt-10">
          <Link to="/project" className="theme-btn">
            SEE THE WINNING RESULTS
          </Link>
        </div>
      </div>
    </section>
  );
}
