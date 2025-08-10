import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";

// The new filter categories
const filters = ["All", "Creative", "Marketing", "Development"];

export default function ProjectPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch portfolio data from the backend when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/portfolio");
        setAllProjects(response.data.data);
        setFilteredProjects(response.data.data); // Initially show all
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle filtering when the active filter changes
  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredProjects(allProjects);
    } else {
      const newProjects = allProjects.filter(
        (project) => project.category === activeFilter,
      );
      setFilteredProjects(newProjects);
    }
  }, [activeFilter, allProjects]);

  return (
    <>
      <SeoHelmet pageUrl="/project" />
      {/* Breadcrumb Section */}
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

      {/* Portfolio Section */}
      <section className="portfolio-section section-padding section-bg">
        <div className="container">
          {/* Filter Navigation */}
          <ul className="nav">
            <Fade direction="up" cascade damping={0.1} triggerOnce>
              {filters.map((filter) => (
                <li key={filter} className="nav-item">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveFilter(filter);
                    }}
                    className={`nav-link ${
                      activeFilter === filter ? "active" : ""
                    }`}
                  >
                    {filter}
                  </a>
                </li>
              ))}
            </Fade>
          </ul>

          {/* Video Grid */}
          <div className="tab-content">
            <div className="tab-pane fade show active">
              <div className="row">
                {loading ? (
                  <p>Loading portfolio...</p>
                ) : (
                  filteredProjects.map((project, index) => (
                    <div key={project._id} className="col-lg-4 col-md-6 col-12">
                      <Fade direction="up" delay={index * 100} triggerOnce>
                        <div className="portfolio-video-card">
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
                          <div className="portfolio-video-content">
                            <h6>
                              <span>//</span> {project.category}
                            </h6>
                            <h3>{project.title}</h3>
                          </div>
                        </div>
                      </Fade>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
