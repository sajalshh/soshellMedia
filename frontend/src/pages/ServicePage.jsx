import React from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import SeoHelmet from "../components/SeoHelmet";

// 1. We now IMPORT the services data from our central file
import { servicesData } from "../data/servicesData";

export default function ServicePage() {
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
                Solutions That <span className="text-neon">Drive Growth</span>
              </h1>
            </Fade>
          </div>
          <div className="breadcrumb-description">
            <Fade direction="up" delay={500} triggerOnce>
              <p>
                Let’s face it: attention spans are shrinking, and competition is
                fierce. That’s why Soshell Media delivers more than just videos
                or ads — we craft complete brand experiences that stick. From
                captivating videography and seamless post-production to tailored
                ad campaigns, persuasive copywriting, data-driven reporting,
                high-performance websites, and SEO that gets you found, we bring
                your brand to life beautifully, powerfully, and on-point. Based
                in Canada, we’re your all-in-one partner for standing out and
                driving real growth in the digital age.
              </p>
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
                Your Brand <br />
                <span>
                  Reimagined{" "}
                  <b className="font-marcellus">for the Scroll Age</b>
                </span>
              </h2>
            </Fade>
          </div>
          <div className="row">
            {/* 2. We map over the IMPORTED servicesData */}
            {servicesData.map((service) => (
              <div
                key={service.slug} // Use the unique slug as the key
                className="col-lg-6 col-md-12 wow fadeInUp"
                data-wow-delay={service.delay}
              >
                <div className="service-box-items">
                  <div className="service-image">
                    <img src={service.imageSrc} alt={service.title} />
                  </div>
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <p className="service-subtitle">{service.subtitle}</p>
                    <p>{service.description}</p>
                    {/* 3. The link is now DYNAMIC and uses the slug */}
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
                 Get free generate{" "}
                <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
              </Link>
            </Fade>
          </div>
        </div>
      </div>
    </>
  );
}
