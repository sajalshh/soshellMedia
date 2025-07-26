import React from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

export default function ServicePage() {
  return (
    <>
      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> our services
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h1>
                Our <span>Services</span>
              </h1>
            </Fade>
          </div>
        </div>
      </div>

      {/* Service Section */}
      <section
        className="service-section style-padding fix section-padding bg-cover"
        style={{ backgroundImage: "url('/assets/img/service/Pattern.png')" }}
      >
        <div className="container">
          <div className="section-title text-center">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> popular services
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                Exclusive AI-powered <br />
                <span>
                  idea & <b>automation</b> services
                </span>
              </h2>
            </Fade>
          </div>
          <div className="row">
            {/* You can map through an array of services here for cleaner code */}
            <div className="col-xl-6 wow fadeInUp" data-wow-delay=".2s">
              <div className="service-box-items">
                <div className="service-image">
                  <img src="/assets/img/service/01.jpg" alt="img" />
                </div>
                <div className="service-content">
                  <h3>Business strategy planning</h3>
                  <p>
                    Duise sagettis rosend accumsas magna onest curos adipiscine
                    contacting the agency secondar
                  </p>
                  <Link to="/service-details" className="link-btn">
                    more details{" "}
                    <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInUp" data-wow-delay=".4s">
              <div className="service-box-items">
                <div className="service-image">
                  <img src="/assets/img/service/02.jpg" alt="img" />
                </div>
                <div className="service-content">
                  <h3>Data analysis services</h3>
                  <p>
                    Duise sagettis rosend accumsas magna onest curos adipiscine
                    contacting the agency secondar
                  </p>
                  <Link to="/service-details" className="link-btn">
                    more details{" "}
                    <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInUp" data-wow-delay=".6s">
              <div className="service-box-items">
                <div className="service-image">
                  <img src="/assets/img/service/03.jpg" alt="img" />
                </div>
                <div className="service-content">
                  <h3>Machine learning models</h3>
                  <p>
                    Duise sagettis rosend accumsas magna onest curos adipiscine
                    contacting the agency secondar
                  </p>
                  <Link to="/service-details" className="link-btn">
                    more details{" "}
                    <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInUp" data-wow-delay=".8s">
              <div className="service-box-items">
                <div className="service-image">
                  <img src="/assets/img/service/04.jpg" alt="img" />
                </div>
                <div className="service-content">
                  <h3>Custom artificial solutions</h3>
                  <p>
                    Duise sagettis rosend accumsas magna onest curos adipiscine
                    contacting the agency secondar
                  </p>
                  <Link to="/service-details" className="link-btn">
                    more details{" "}
                    <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="cta-section-4 fix">
        <div className="container">
          <div
            className="cta-wrapper mt-0 bg-cover"
            style={{ backgroundImage: "url('/assets/img/cta-bg.jpg')" }}
          >
            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                Experience the future of <br />
                <span></span> creation
              </h2>
            </Fade>
            <Fade direction="up" delay={500} triggerOnce>
              <Link to="/contact" className="theme-btn style-2">
                free generate{" "}
                <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
              </Link>
            </Fade>
          </div>
        </div>
      </div>
    </>
  );
}
