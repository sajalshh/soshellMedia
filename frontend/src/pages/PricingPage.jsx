import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";

// REMOVE the hardcoded filters array
// const filters = ["All", "Creative", "Marketing", "Development"];

export default function ProjectPage() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]); // <-- ADD CATEGORIES STATE
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        // Fetch both projects and categories
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
      // --- UPDATE FILTERING LOGIC ---
      const newProjects = allProjects.filter(
        (project) => project.category?.name === activeFilter,
      );
      setFilteredProjects(newProjects);
    }
  }, [activeFilter, allProjects]);

  return (
    <>
      {/* ... SeoHelmet and Breadcrumb ... */}

      {/* Portfolio Section */}
      <section className="portfolio-section section-padding section-bg">
        <div className="container">
          {/* Filter Navigation */}
          <ul className="nav">
            <Fade direction="up" cascade damping={0.1} triggerOnce>
              {/* --- DYNAMICALLY RENDER 'ALL' FILTER --- */}
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
              {/* --- DYNAMICALLY RENDER CATEGORY FILTERS --- */}
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
                          {/* ... iframe ... */}
                          <div className="portfolio-video-content">
                            <h6>
                              {/* --- UPDATE CATEGORY DISPLAY --- */}
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
