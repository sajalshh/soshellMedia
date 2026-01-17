import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { Volume2, VolumeX } from "lucide-react";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";

// --- Skeleton Loader Component ---
const SkeletonCard = () => (
  <div className="tw-w-full tw-animate-pulse">
    <div className="tw-aspect-[9/16] tw-bg-gray-800 tw-rounded-xl"></div>
    <div className="tw-mt-4">
      <div className="tw-h-4 tw-w-1/3 tw-bg-gray-700 tw-rounded"></div>
      <div className="tw-h-6 tw-w-3/4 tw-bg-gray-700 tw-rounded tw-mt-2"></div>
    </div>
  </div>
);

export default function ProjectPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        const [projectsResponse, categoriesResponse] = await Promise.all([
          api.get("/portfolio"),
          api.get("/categories"),
        ]);

        setAllProjects(projectsResponse.data.data);
        setFilteredProjects(projectsResponse.data.data);
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredProjects(allProjects);
    } else {
      const newProjects = allProjects.filter(
        (project) => project.category?.name === activeFilter,
      );
      setFilteredProjects(newProjects);
    }
  }, [activeFilter, allProjects]);

  const handleVideoClick = (id) => {
    setActiveVideoId((prevId) => (prevId === id ? null : id));
  };

  return (
    <>
      <SeoHelmet pageUrl="/project" />

      {/* === PORTFOLIO SECTION (Small Top Space + Small Heading) === */}
      <section
        className="portfolio-section section-bg"
        style={{
          paddingTop: "100px",
          paddingBottom: "60px",
        }}
      >
        <div className="container">
          {/* Small Heading */}
          <div
            className="tw-text-center tw-mb-10"
            style={{ marginTop: "40px" }}
          >
            <Fade direction="up" triggerOnce>
              <h2 className="tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white">
                Creative{" "}
                <span className="tw-text-[var(--tp-theme-primary)]">
                  Portfolio
                </span>
              </h2>
            </Fade>
          </div>

          {/* Filter Bar */}
          <div className="tw-flex tw-justify-center tw-mb-12">
            <ul className="tw-flex tw-flex-wrap tw-gap-4 md:tw-gap-8">
              {["All", ...categories.map((c) => c.name)].map((filter) => (
                <li key={filter} className="nav-item">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveFilter(filter);
                    }}
                    className={`tw-relative tw-block tw-pb-2 tw-text-lg tw-font-semibold tw-transition-colors ${
                      activeFilter === filter
                        ? "tw-text-[var(--tp-theme-primary)]"
                        : "tw-text-gray-400 hover:tw-text-white"
                    }`}
                  >
                    {filter}
                    <span
                      className={`tw-absolute tw-bottom-0 tw-left-0 tw-block tw-h-0.5 tw-bg-[var(--tp-theme-primary)] tw-transition-all tw-duration-300 ${
                        activeFilter === filter ? "tw-w-full" : "tw-w-0"
                      }`}
                    ></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Video Grid */}
          <div className="tw-max-w-6xl tw-mx-auto">
            <div className="row">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="col-lg-3 col-md-4 col-sm-6 col-12 tw-mb-8"
                    >
                      <SkeletonCard />
                    </div>
                  ))
                : filteredProjects.map((project) => {
                    const isUnmuted = activeVideoId === project._id;

                    return (
                      <div
                        key={project._id}
                        className="col-lg-3 col-md-4 col-sm-6 col-12 tw-mb-8"
                      >
                        <Fade direction="up" triggerOnce>
                          <div
                            className="portfolio-video-card tw-group tw-cursor-pointer"
                            onClick={() => handleVideoClick(project._id)}
                          >
                            <div
                              className={`portfolio-video-wrapper tw-relative tw-overflow-hidden tw-rounded-xl tw-shadow-lg tw-transition-all tw-duration-300 group-hover:tw-scale-105 ${
                                isUnmuted
                                  ? "tw-shadow-[0_0_25px_rgba(3,220,176,0.5)] tw-border-2 tw-border-[var(--tp-theme-primary)]"
                                  : ""
                              }`}
                            >
                              <video
                                src={project.videoUrl}
                                autoPlay
                                loop
                                playsInline
                                muted={!isUnmuted}
                                className="tw-w-full tw-h-full tw-object-cover tw-aspect-[9/16]"
                              />

                              {/* Sound Icon Overlay */}
                              <div className="tw-absolute tw-bottom-4 tw-right-4 tw-z-20 tw-bg-black/50 tw-p-2 tw-rounded-full tw-backdrop-blur-sm tw-transition-all tw-duration-300">
                                {isUnmuted ? (
                                  <Volume2
                                    size={20}
                                    className="tw-text-[var(--tp-theme-primary)]"
                                  />
                                ) : (
                                  <VolumeX
                                    size={20}
                                    className="tw-text-white/70"
                                  />
                                )}
                              </div>

                              {/* Hover Hint */}
                              <div
                                className={`tw-absolute tw-inset-0 tw-bg-black/20 tw-flex tw-items-center tw-justify-center tw-transition-opacity tw-duration-300 ${
                                  isUnmuted
                                    ? "tw-opacity-0"
                                    : "tw-opacity-0 group-hover:tw-opacity-100"
                                }`}
                              >
                                <p className="tw-text-white tw-font-bold tw-tracking-wider tw-text-sm tw-bg-black/50 tw-px-3 tw-py-1 tw-rounded-full">
                                  CLICK FOR SOUND
                                </p>
                              </div>
                            </div>

                            <div className="portfolio-video-content">
                              <h6>
                                <span>//</span> {project.category?.name}
                              </h6>
                              <h3>{project.title}</h3>
                            </div>
                          </div>
                        </Fade>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
