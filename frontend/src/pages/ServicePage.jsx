// src/pages/ServicePage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";

export default function ServicePage() {
  const [pageContent, setPageContent] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both sets of data concurrently
        const [contentRes, servicesRes] = await Promise.all([
          api.get("/services/content"),
          api.get("/services/cards"),
        ]);
        setPageContent(contentRes.data.data);
        setServices(servicesRes.data.data);
      } catch (error) {
        console.error("Failed to fetch service page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SeoHelmet pageUrl="/services" />
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
                {/* DYNAMIC CONTENT */}
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      pageContent?.breadcrumbHeading.replace(
                        "Growth",
                        '<span class="text-neon">Growth</span>',
                      ) || "",
                  }}
                />
              </h1>
            </Fade>
          </div>
          <div className="breadcrumb-description">
            <Fade direction="up" delay={500} triggerOnce>
              {/* DYNAMIC CONTENT */}
              <p>{pageContent?.breadcrumbDescription}</p>
            </Fade>
          </div>
        </div>
      </div>

      {/* Service Section */}
      <section
        className="service-section style-padding fix section-padding bg-cover pt-0"
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
                {/* DYNAMIC CONTENT */}
                {pageContent?.sectionTitle} <br />
                <span>
                  {pageContent?.sectionSubtitle
                    .split(" ")
                    .slice(0, -2)
                    .join(" ")}{" "}
                  <b className="font-marcellus">
                    {pageContent?.sectionSubtitle
                      .split(" ")
                      .slice(-2)
                      .join(" ")}
                  </b>
                </span>
              </h2>
            </Fade>
          </div>
          <div className="row">
            {/* DYNAMICALLY MAPPED SERVICES */}
            {services.map((service, index) => (
              <div
                key={service.slug}
                className="col-lg-6 col-md-12 wow fadeInUp"
                data-wow-delay={`${(index * 0.2).toFixed(1)}s`} // Dynamic delay
              >
                <div className="service-box-items">
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                  </div>
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p className="service-subtitle">{service.subtitle}</p>
                    <p>{service.description}</p>
                    <Link
                      to={`/service-details/${service.slug}`}
                      className="link-btn"
                    >
                      more details{" "}
                      <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (unchanged) */}
      <div className="cta-section-4 fix">
        {/* ... your existing CTA code ... */}
      </div>
    </>
  );
}
