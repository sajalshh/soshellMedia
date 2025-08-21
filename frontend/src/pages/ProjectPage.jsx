import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";

// --- CHANGE 1: REMOVED the hardcoded filters array ---
// const filters = ["All", "Creative", "Marketing", "Development"];

export default function ProjectPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]); // <-- ADD STATE for dynamic categories
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // --- CHANGE 2: Fetch BOTH projects and categories from the backend ---
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        // Fetch both sets of data in parallel for efficiency
        const [projectsResponse, categoriesResponse] = await Promise.all([
          api.get("/portfolio"),
          api.get("/categories"),
        ]);

        setAllProjects(projectsResponse.data.data);
        setFilteredProjects(projectsResponse.data.data); // Initially show all
        setCategories(categoriesResponse.data.data); // Save dynamic categories to state
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  // --- CHANGE 3: Update the filtering logic to check the category NAME ---
  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredProjects(allProjects);
    } else {
      // Compare against project.category.name instead of project.category
      const newProjects = allProjects.filter(
        (project) => project.category?.name === activeFilter,
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
          {/* --- CHANGE 4: Dynamically generate filter buttons from state --- */}
          <ul className="nav">
            <Fade direction="up" cascade damping={0.1} triggerOnce>
              {/* "All" button is still static */}
              <li key="All" className="nav-item">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveFilter("All");
                  }}
                  className={`nav-link ${
                    activeFilter === "All" ? "active" : ""
                  }`}
                >
                  All
                </a>
              </li>
              {/* Map over the fetched categories to create the other buttons */}
              {categories.map((category) => (
                <li key={category._id} className="nav-item">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveFilter(category.name);
                    }}
                    className={`nav-link ${
                      activeFilter === category.name ? "active" : ""
                    }`}
                  >
                    {category.name}
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
                              {/* --- CHANGE 5: Display the category NAME --- */}
                              <span>//</span> {project.category?.name}
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
