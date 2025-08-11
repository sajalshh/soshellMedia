import React, { useState } from "react";

export default function Faq() {

  const [openItem, setOpenItem] = useState("faq1");


  const handleItemClick = (itemId) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <section className="faq-section fix section-padding">
      <div className="color-bg">
        <img src="/assets/img/faq/color-bg.png" alt="img" />
      </div>
      <div className="container">
        <div className="faq-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="faq-image-items">
                <div className="faq-image wow fadeInUp" data-wow-delay=".3s">
                  <img src="/assets/img/faq/01.jpg" alt="img" />
                </div>
                <div className="faq-image wow fadeInUp" data-wow-delay=".5s">
                  <img src="/assets/img/faq/02.jpg" alt="img" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="faq-content">
                <div className="section-title">
                  <h6 className="faqs">
                    <img src="/assets/img/star.png" alt="img" /> FAQs
                  </h6>
                  <h2>
                    Got Questions?
                    <span>
                      We’ve Got <b>Answers.</b>
                    </span>
                  </h2>
                </div>
                <div className="faq-accordion">
                  <div className="accordion" id="accordion">
                    {/* -- Accordion Item 1 -- */}
                    <div
                      className="accordion-item wow fadeInUp"
                      data-wow-delay=".2s"
                    >
                      <h5 className="accordion-header">
                        <button
                          className={`accordion-button ${
                            openItem !== "faq1" ? "collapsed" : ""
                          }`}
                          type="button"
                          onClick={() => handleItemClick("faq1")}
                          aria-expanded={openItem === "faq1"}
                        >
                          Personalized dashboard
                        </button>
                      </h5>
                      <div
                        className={`accordion-collapse collapse ${
                          openItem === "faq1" ? "show" : ""
                        }`}
                      >
                        <div className="accordion-body">
                          Rhoncus duis urna lobortis at fusce cum accumsan
                          tempor ads orci etiam litora dignissim ipsum lacinia
                          hendrerit convallis vitae Consequat enim phasellus
                          purus
                        </div>
                      </div>
                    </div>
                    {/* -- Accordion Item 2 -- */}
                    <div
                      className="accordion-item wow fadeInUp"
                      data-wow-delay=".4s"
                    >
                      <h5 className="accordion-header">
                        <button
                          className={`accordion-button ${
                            openItem !== "faq2" ? "collapsed" : ""
                          }`}
                          type="button"
                          onClick={() => handleItemClick("faq2")}
                          aria-expanded={openItem === "faq2"}
                        >
                          Consultation booking system
                        </button>
                      </h5>
                      <div
                        className={`accordion-collapse collapse ${
                          openItem === "faq2" ? "show" : ""
                        }`}
                      >
                        <div className="accordion-body">
                          Rhoncus duis urna lobortis at fusce cum accumsan
                          tempor ads orci etiam litora dignissim ipsum lacinia
                          hendrerit convallis vitae Consequat enim phasellus
                          purus
                        </div>
                      </div>
                    </div>
                    {/* -- Accordion Item 3 -- */}
                    <div
                      className="accordion-item wow fadeInUp"
                      data-wow-delay=".6s"
                    >
                      <h5 className="accordion-header">
                        <button
                          className={`accordion-button ${
                            openItem !== "faq3" ? "collapsed" : ""
                          }`}
                          type="button"
                          onClick={() => handleItemClick("faq3")}
                          aria-expanded={openItem === "faq3"}
                        >
                          AI insights and analytics
                        </button>
                      </h5>
                      <div
                        className={`accordion-collapse collapse ${
                          openItem === "faq3" ? "show" : ""
                        }`}
                      >
                        <div className="accordion-body">
                          Rhoncus duis urna lobortis at fusce cum accumsan
                          tempor ads orci etiam litora dignissim ipsum lacinia
                          hendrerit convallis vitae Consequat enim phasellus
                          purus
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
