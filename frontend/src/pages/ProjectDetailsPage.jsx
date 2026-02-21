

import React from "react";
import { useParams, Link } from "react-router-dom";
import { allProjects } from "../data";
import NotFoundPage from "./NotFoundPage";
import SeoHelmet from "../components/SeoHelmet";
import breadcrumbBg from "../assets/img/breadcrumb-bg.jpg";
import starIcon from "../assets/img/star.png";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project = allProjects.find((p) => p.id === parseInt(projectId));

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SeoHelmet
        pageUrl={`/project-details/${projectId}`}
        title={project.title}
        description={project.description}
      />
      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: `url(${breadcrumbBg})` }}
      >
        <div className="container">
          <div className="page-heading">
            <h6>
              <img src="/assets/img/star.png" alt="img" /> portfolio details
            </h6>
            <h1>{project.title}</h1>
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <section className="portfolio-details-section section-padding fix section-bg">
        <div className="container">
          <div className="project-details-wrapper">
            <div className="row g-4">
              <div className="col-xl-4">
                <div className="project-sidebar">
                  {/* ... Sidebar Info ... */}
                </div>
              </div>
              <div className="col-xl-8">
                <div className="project-details-content">
                  <h2>{project.title}</h2>
                  <p className="mb-5">
                    Nec pretium eget dictumst donec pretium quam mi ad vulputate
                    risus mus rutrum nascetur sed imperdiet maecenas etiam
                    nullam odio metus netus velit platea adipiscing.
                  </p>
                  <div className="details-image">
                    <img
                      src={project.imgSrc}
                      alt={project.title}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
