import React, { useState } from "react";

// Import the images from their new location
import faqImage1 from "../assets/faq/faq1.png";
import faqImage2 from "../assets/faq/faq2.png";
import colorBg from "../assets/img/faq/color-bg.png";
import starIcon from "../assets/img/star.png";

export default function Faq() {
  const [openItem, setOpenItem] = useState("faq1");

  const handleItemClick = (itemId) => {
    setOpenItem(openItem === itemId ? null : itemId);
  };

  return (
    <section className="faq-section fix section-padding">
      <div className="color-bg">
        {/* Make sure this image path is correct if it's also in assets */}
        <img src={colorBg} alt="background glow" />
      </div>
      <div className="container">
        <div className="faq-wrapper">
          <div className="row g-4">
            <div className="col-lg-6">
              {/* --- CHANGES START HERE --- */}
              {/* Added flex, alignment to bottom, and gap for spacing */}
              <div className="faq-image-items tw-flex tw-items-end tw-gap-6 tw-justify-center lg:tw-justify-start">
                {/* First image container: smaller size */}
                <div
                  className="wow fadeInUp tw-rounded-xl tw-overflow-hidden tw-w-[270px] tw-h-[520px]" // Set specific width and height
                  data-wow-delay=".3s"
                >
                  <img
                    src={faqImage1}
                    alt="faq image 1"
                    className="tw-w-full tw-h-full tw-object-cover" // Ensure image fills its container
                  />
                </div>
                {/* Second image container: larger size */}
                <div
                  className="wow fadeInUp tw-rounded-xl tw-overflow-hidden tw-w-[417px] tw-h-[690px]" // Set specific width and height
                  data-wow-delay=".5s"
                >
                  <img
                    src={faqImage2}
                    alt="faq image 2"
                    className="tw-w-full tw-h-full tw-object-cover" // Ensure image fills its container
                  />
                </div>
              </div>
              {/* --- CHANGES END HERE --- */}
            </div>
            <div className="col-lg-6">
              <div className="faq-content">
                <div className="section-title">
                  <h6 className="faqs">
                    <img src={starIcon} alt="star" /> FAQs
                  </h6>
                  <h2>
                    Got Questions? <br></br>
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
