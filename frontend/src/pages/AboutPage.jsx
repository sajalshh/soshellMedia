import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import api from "../api/axiosConfig";
import SeoHelmet from "../components/SeoHelmet";
import Counter1 from "../components/counter1";

export default function AboutPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutPageContent = async () => {
      try {
        const response = await api.get("/content/about");
        setPageData(response.data);
      } catch (err) {
        console.error("Failed to fetch about page content:", err);
        setError("Could not load page content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPageContent();
  }, []);

  if (loading) {
    return <div className="section-padding text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="section-padding text-center fs-4 text-danger">
        {error}
      </div>
    );
  }

  return (
    <>
      <SeoHelmet pageUrl="/about" />

      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="section-title text-center mx-auto">
            <Fade direction="up" triggerOnce></Fade>

            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                <span className="about">
                  {pageData?.pageContent?.headingPrefix || "About"}{" "}
                </span>{" "}
                <b className="media-name">
                  {pageData?.pageContent?.headingHighlight || "Soshell Media"}
                </b>
              </h2>

              {pageData?.pageContent?.subHeading && (
                <p className="mt-2">{pageData.pageContent.subHeading}</p>
              )}
            </Fade>
          </div>
        </div>
      </div>

      {/* Custom Content Section */}
      <section className="about-section style-padding section-padding fix">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="about-content text-center">
                <Fade direction="up" triggerOnce>
                  {pageData?.pageContent?.paragraphs?.map(
                    (paragraph, index) => (
                      <p
                        key={index}
                        className={`fs-5 ${index > 0 ? "mt-4" : ""}`}
                      >
                        {paragraph}
                      </p>
                    ),
                  )}
                </Fade>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Counter1 />
      {/* Team Section */}
      <section className="team-section fix section-padding section-bg">
        <div className="container">
          <div className="section-title text-center mx-auto custom-section-title">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> dedicated member
              </h6>
            </Fade>

            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                The People Behind <br /> <span>the Purpose</span>
              </h2>
            </Fade>
          </div>

          <div className="row">
            {pageData?.teamMembers?.map((member, index) => (
              <div key={member._id} className="col-xl-3 col-lg-4 col-md-6">
                <Fade direction="up" delay={200 * (index + 1)} triggerOnce>
                  <div className="team-box-items">
                    <div className="team-image">
                      <img src={member.imgSrc} alt={member.name} />
                    </div>

                    <div className="team-content">
                      <h3>{member.name}</h3>
                      <p>{member.title}</p>
                    </div>
                  </div>
                </Fade>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
