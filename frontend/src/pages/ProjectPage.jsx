import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import SeoHelmet from "../components/SeoHelmet";

// Data for all portfolio items
const allProjects = [
  {
    id: 1,
    title: "Futuristic stylish model",
    category: "creative",
    imgSrc: "/assets/img/project/09.jpg",
  },
  {
    id: 2,
    title: "Bold and vibrant design",
    category: "graphic",
    imgSrc: "/assets/img/project/10.jpg",
  },
  {
    id: 3,
    title: "Breathtaking landscape",
    category: "anime",
    imgSrc: "/assets/img/project/11.jpg",
  },
  {
    id: 4,
    title: "Stylishly extravagant toy",
    category: "creative",
    imgSrc: "/assets/img/project/12.jpg",
  },
  {
    id: 5,
    title: "A vintage postcard design",
    category: "graphic",
    imgSrc: "/assets/img/project/13.jpg",
  },
  {
    id: 6,
    title: "Color for simple Company",
    category: "animal",
    imgSrc: "/assets/img/project/14.jpg",
  },
  {
    id: 7,
    title: "Another postcard design",
    category: "graphic",
    imgSrc: "/assets/img/project/15.jpg",
  },
  {
    id: 8,
    title: "Another simple Company color",
    category: "animal",
    imgSrc: "/assets/img/project/16.jpg",
  },
  {
    id: 9,
    title: "Another stylish model",
    category: "creative",
    imgSrc: "/assets/img/project/17.jpg",
  },
];

const filters = ["all", "creative", "anime", "animal", "graphic"];

export default function ProjectPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProjects(allProjects);
    } else {
      const newProjects = allProjects.filter(
        (project) => project.category === activeFilter,
      );
      setFilteredProjects(newProjects);
    }
  }, [activeFilter]);

  return (
    <>
      <SeoHelmet pageUrl="/projects" />
      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> user creation
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
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
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </a>
                </li>
              ))}
            </Fade>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active">
              <div className="row">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="col-xl-4 col-lg-6 col-md-6">
                    <Fade direction="up" delay={index * 100} triggerOnce>
                      <div className="portfolio-card-items">
                        <div className="portfolio-image">
                          <img src={project.imgSrc} alt={project.title} />
                          <Link
                            to={`/project-details/${project.id}`}
                            className="lets-circle"
                          >
                            <i className="fa-sharp fa-regular fa-arrow-up-right"></i>{" "}
                            <br />
                            Project details
                          </Link>
                        </div>
                        <div className="portfolio-content">
                          <h6>
                            <span>//</span> {project.category}
                          </h6>
                          <h3>
                            <Link to={`/project-details/${project.id}`}>
                              {project.title}
                            </Link>
                          </h3>
                        </div>
                      </div>
                    </Fade>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
