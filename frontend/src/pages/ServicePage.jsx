import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";
import Pricing from "../components/Pricing";
import breadcrumbBg from "../assets/img/breadcrumb-bg.jpg";
import starIcon from "../assets/img/star.png";
import servicePattern from "../assets/img/service/Pattern.png";

export default function ServicePage() {
  const [pageContent, setPageContent] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        style={{ backgroundImage: `url(${breadcrumbBg})` }}
      >
        <div className="container">
          <div className="page-heading">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src={starIcon} alt="img" /> our services
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h1>
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
              <p>{pageContent?.breadcrumbDescription}</p>
            </Fade>
          </div>
        </div>
      </div>

      {/* Service Section */}
      <section
        className="service-section style-padding fix section-padding bg-cover pt-0"
        style={{ backgroundImage: `url(${servicePattern})` }}
      >
        <div className="container">
          <div className="section-title text-center">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src={starIcon} alt="img" /> popular services
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h2>
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
            {services.map((service, index) => (
              <div
                key={service.slug}
                className="col-lg-6 col-md-12 wow fadeInUp"
                data-wow-delay={`${(index * 0.2).toFixed(1)}s`}
              >
                <div className="service-box-items">
                  <div className="service-image">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                    />
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

      {/* 2. RENDER the PricingPage component at the end */}
      <Pricing />
    </>
  );
}
