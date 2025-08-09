import React from "react";
import { useParams, Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { servicesData } from "../data/servicesData"; // Import our new data
import SeoHelmet from "../components/SeoHelmet";
import NotFoundPage from "./NotFoundPage";

export default function ServiceDetailsPage() {
  // 1. Get the unique 'slug' from the URL (e.g., 'videography')
  const { slug } = useParams();

  // 2. Find the correct service data from our array that matches the slug
  const service = servicesData.find((s) => s.slug === slug);

  // 3. If no service matches the URL slug, show a 404 Not Found page
  if (!service) {
    return <NotFoundPage />;
  }

  // 4. If a service is found, render the page with its data
  return (
    <>
      <SeoHelmet pageUrl={`/service-details/${service.slug}`} />

      {/* The new main heading you requested */}
      <section className="service-details-hero section-padding section-bg">
        <div className="container">
          <div className="section-title text-center">
            <Fade direction="up" triggerOnce>
              <h1 className="service-details-heading">
                Detailed <span className="font-marcellus">Services</span>
              </h1>
            </Fade>
          </div>
        </div>
      </section>

      {/* The "Benefit Section" using the dynamic data for the selected service */}
      <section className="benefit-section fix section-padding section-bg pt-0">
        <div className="container">
          <div className="benefit-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-xl-4 col-lg-6">
                <div className="benefit-left-content">
                  <div className="section-title">
                    <Fade direction="up" triggerOnce>
                      <h6>
                        <img src="/assets/img/star.png" alt="img" />
                        {service.title}
                      </h6>
                    </Fade>
                    <Fade direction="up" delay=".3s" triggerOnce>
                      <h2>{service.detailTitle}</h2>
                    </Fade>
                  </div>
                  <Fade direction="up" delay=".4s" triggerOnce>
                    <p
                      className="mt-3 mt-md-0"
                      dangerouslySetInnerHTML={{
                        __html: service.detailSubtitle,
                      }}
                    ></p>
                  </Fade>
                  <Fade direction="up" delay=".5s" triggerOnce>
                    <Link to="/contact" className="theme-btn">
                      Get free generate{" "}
                      <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                    </Link>
                  </Fade>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6">
                <Fade direction="up" triggerOnce>
                  <div className="benefit-image">
                    {/* Use a placeholder image or a specific one from your data */}
                    <img
                      src="/assets/img/benefit-image.jpg"
                      alt={service.title}
                    />
                  </div>
                </Fade>
              </div>
              <div className="col-xl-4 col-lg-6">
                <Fade direction="up" triggerOnce>
                  <div className="benefit-right-items single-benefit-text">
                    <p>{service.detailParagraph}</p>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
