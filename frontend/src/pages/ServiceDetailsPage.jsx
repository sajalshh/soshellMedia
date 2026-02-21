// src/pages/ServiceDetailsPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { FaCheckCircle } from "react-icons/fa";
import api from "../api/axiosConfig";
import starIcon from "../assets/img/star.png";
import SeoHelmet from "../components/SeoHelmet";
import NotFoundPage from "./NotFoundPage";

export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/services/cards/slug/${slug}`);
        setService(response.data.data);
      } catch (err) {
        console.error("Failed to fetch service details:", err);
        setError("Could not load service details.");
        if (err.response && err.response.status === 404) {
          setService(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [slug]);

  if (loading) {
    return <div className="section-padding">Loading...</div>;
  }

  if (error || !service) {
    return <NotFoundPage />;
  }

  return (
    <>
      <SeoHelmet
        pageTitle={service.detailTitle || service.title}
        pageDescription={service.description}
        pageUrl={`/service-details/${service.slug}`}
      />

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

      <section className="benefit-section fix section-padding section-bg pt-0">
        <div className="container">
          <div className="benefit-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-xl-4 col-lg-6">
                <div className="benefit-left-content">
                  <div className="section-title">
                    <Fade direction="up" triggerOnce>
                      <h6>
                        <img src={starIcon} alt="star" />
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
                      Get a Free Quote{" "}
                      <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                    </Link>
                  </Fade>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6">
                <Fade direction="up" triggerOnce>
                  <div className="benefit-image">
                    <img
                      src={service.detailImage || "/assets/img/placeholder.jpg"}
                      alt={service.detailTitle || service.title}
                    />
                  </div>
                </Fade>
              </div>
              <div className="col-xl-4 col-lg-6">
                <Fade direction="up" triggerOnce>
                  <div className="benefit-right-items single-benefit-text">
                    {/* UPDATED: Safely render the list only if it has items */}
                    {service.detailPoints &&
                      service.detailPoints.length > 0 && (
                        <ul className="service-points-list">
                          {service.detailPoints.map((point, index) => (
                            <li key={index}>
                              <FaCheckCircle className="icon" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
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
