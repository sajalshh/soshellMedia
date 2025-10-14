import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { Play } from "lucide-react";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";

// --- Skeleton Loader Component for a beautiful loading state ---
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
        (project) => project.category?.name === activeFilter
      );
      setFilteredProjects(newProjects);
    }
  }, [activeFilter, allProjects]);

  return (
    <>
      <SeoHelmet pageUrl="/project" />

      {/* === HEADER === */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <Fade direction="up" triggerOnce>
              <h1>
                Creative <span>Portfolio</span>
              </h1>
            </Fade>
          </div>
        </div>
      </div>

      {/* === PORTFOLIO SECTION === */}
      <section className="portfolio-section section-padding section-bg">
        <div className="container">
          {/* Elegant Filter Bar */}
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
                    {/* Underline animation */}
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
          {/* This wrapper div makes the videos smaller on desktop */}
          <div className="tw-max-w-6xl tw-mx-auto">
            <div className="row">
              {loading
                ? // Creative Skeleton Loading State
                  Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="col-lg-3 col-md-4 col-sm-6 col-12 tw-mb-8"
                    >
                      <SkeletonCard />
                    </div>
                  ))
                : filteredProjects.map((project) => (
                    <div
                      key={project._id}
                      className="col-lg-3 col-md-4 col-sm-6 col-12 tw-mb-8"
                    >
                      <Fade direction="up" triggerOnce>
                        <div className="portfolio-video-card tw-group">
                          <div className="portfolio-video-wrapper tw-relative tw-overflow-hidden tw-rounded-xl tw-shadow-lg tw-transition-all tw-duration-300 group-hover:tw-scale-105 group-hover:tw-shadow-[0_0_25px_rgba(3,220,176,0.5)]">
                            <iframe
                              src={`${project.videoUrl}?autoplay=1&loop=1&mute=1&playsinline=1&controls=0`}
                              title={project.title}
                              allow="autoplay; fullscreen"
                              frameBorder="0"
                              className="wistia_embed"
                            ></iframe>
                            {/* Play Icon Overlay */}
                            <div className="tw-absolute tw-inset-0 tw-bg-black/20 tw-flex tw-items-center tw-justify-center tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity">
                              <Play size={48} className="tw-text-white" />
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
                  ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}