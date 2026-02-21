import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import lineShapeBg from "../../src/assets/img/project/line-shape.png";
import colorBg from "../../src/assets/img/project/color-bg.png";
import hasIcon from "../../src/assets/img/has.png";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/homepage/projects");
        setProjects(response.data.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="project-section fix section-padding section-bg"></section>
    );
  }

  return (
    <section
      className="project-section fix section-padding section-bg bg-cover"
      style={{ backgroundImage: `url(${lineShapeBg})` }}
    >
      <div className="color-bg">
        <img src={colorBg} alt="glow background" />
      </div>
      <div className="project-wrapper">
        <h2
          className="project-title text-center wow fadeInUp"
          data-wow-delay=".3s"
        >
          Selected <br /> <img src={hasIcon} alt="icon" />{" "}
          <span className="text-neon">Projects</span>
        </h2>

        <div className="row align-items-center">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            const imageBlock = (
              <div
                className="col-lg-6 wow fadeInUp"
                data-wow-delay={isEven ? ".3s" : ".5s"}
              >
                <div className={`project-image ${!isEven ? "style-2" : ""}`}>
                  <img
                    src={project.image}
                    alt={project.title.replace(/\|/g, " ")}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            );

            const contentBlock = (
              <div
                className="col-lg-6 wow fadeInUp"
                data-wow-delay={isEven ? ".5s" : ".3s"}
              >
                <div
                  className={`project-content pro ${
                    !isEven ? "content-reversed" : ""
                  }`}
                >
                  <span>{project.date}</span>
                  <h3>
                    <a
                      href={project.projectLink}
                      dangerouslySetInnerHTML={{
                        __html: project.title.replace(/\|/g, "<br />"),
                      }}
                    />
                  </h3>
                  <p>{project.description}</p>
                  <a href={project.projectLink} className="theme-btn">
                    explore now{" "}
                    <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            );

            return isEven ? (
              <React.Fragment key={project._id}>
                {imageBlock}
                {contentBlock}
              </React.Fragment>
            ) : (
              <React.Fragment key={project._id}>
                {contentBlock}
                {imageBlock}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
