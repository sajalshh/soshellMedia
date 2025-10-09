import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import api from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import SeoHelmet from "../components/SeoHelmet";

// Component to render a single case study item in the list
const CaseStudyItem = ({ study }) => {
  const imageUrl = study.featuredImage || "/assets/img/blog/post-1.jpg"; // Fallback image
  const industry = study.industry || "General";

  return (
    <div className="news-standard-items">
      <div className="news-thumb">
        <img src={imageUrl} alt={study.title} />
      </div>
      <div className="news-content">
        <ul>
          <li>
            <i className="fa-regular fa-building"></i>
            Client: {study.client || "Confidential"}
          </li>
          <li>
            <i className="fa-regular fa-folder-open"></i>
            {industry}
          </li>
        </ul>
        <h3>
          <Link
            to={`/casestudy-details/${study.slug}`}
            dangerouslySetInnerHTML={{ __html: study.title }}
          />
        </h3>
        <div dangerouslySetInnerHTML={{ __html: study.excerpt }} />
        <Link to={`/casestudy-details/${study.slug}`} className="theme-btn mt-4">
          View Case Study <i className="fa-solid fa-arrow-right-long"></i>
        </Link>
      </div>
    </div>
  );
};

export default function CaseStudiesPage() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await api.get("/casestudies");
        setStudies(response.data.data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  if (loading) {
    return <div className="section-padding">Loading case studies...</div>;
  }

  return (
    <>
      <SeoHelmet
        title="Our Case Studies"
        description="Explore our successful projects and see how we've helped our clients achieve their goals."
        pageUrl="/casestudies"
      />
      <section
        className="news-hero-section bg-cover"
        style={{
          backgroundImage: "url('/assets/casestudies/casestudy-banner.jpg')",
          backgroundPosition: "center 0px",
        }}
      >
        <style jsx>{`
          @media (max-width: 768px) {
            .news-hero-section {
              background-position: center 10px; /* more push for mobile */
            }
          }
        `}</style>
      </section>

      <section className="news-standard fix section-padding">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="news-standard-wrapper">
                {studies.map((study, index) => (
                  <Fade
                    direction="up"
                    delay={index * 100}
                    triggerOnce
                    key={study._id}
                  >
                    <CaseStudyItem study={study} />
                  </Fade>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}