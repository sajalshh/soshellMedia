import React from "react";

export default function Projects() {
  return (
    <section
      className="project-section fix section-padding section-bg bg-cover"
      style={{ backgroundImage: "url('/assets/img/project/line-shape.png')" }}
    >
      <div className="color-bg">
        <img src="/assets/img/project/color-bg.png" alt="img" />
      </div>
      <div className="project-wrapper">
        <h2
          className="project-title text-center wow fadeInUp"
          data-wow-delay=".3s"
        >
          Selected <br /> <img src="/assets/img/has.png" alt="img" />{" "}
          <span>Projects</span>
        </h2>
        <div className="row align-items-center">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
            <div className="project-image">
              <img src="/assets/img/project/01.jpg" alt="img" />
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
            <div className="project-content">
              <span>25 july, 2024</span>
              <h3>
                <a href="/project">
                  Machine <br />
                  learning
                </a>
              </h3>
              <p>
                Duise sagettise rosend acum oneste curos adipiscine contacting
                the everyday agency secondar overseas
              </p>
              <a href="project-details.html" className="theme-btn">
                explore now{" "}
                <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
            <div className="project-content">
              <span>25 july, 2024</span>
              <h3>
                <a href="project-details.html">
                  Business <br />
                  analytics
                </a>
              </h3>
              <p>
                Duise sagettise rosend acum oneste curos adipiscine contacting
                the everyday agency secondar overseas
              </p>
              <a href="project-details.html" className="theme-btn">
                explore now{" "}
                <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
            <div className="project-image style-2">
              <img src="/assets/img/project/02.jpg" alt="img" />
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".3s">
            <div className="project-image">
              <img src="/assets/img/project/03.jpg" alt="img" />
            </div>
          </div>
          <div className="col-lg-6 wow fadeInUp" data-wow-delay=".5s">
            <div className="project-content">
              <span>25 july, 2024</span>
              <h3>
                <a href="project-details.html">
                  Marketing <br />
                  solutions
                </a>
              </h3>
              <p>
                Duise sagettise rosend acum oneste curos adipiscine contacting
                the everyday agency secondar overseas
              </p>
              <a href="project-details.html" className="theme-btn">
                explore now{" "}
                <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
