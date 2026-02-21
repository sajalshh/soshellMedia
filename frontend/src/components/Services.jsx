import React from "react";
import starIcon from "../../src/assets/img/star.png";
import serviceImg1 from "../../src/assets/img/service/01.jpg";
import serviceImg2 from "../../src/assets/img/service/02.jpg";
import serviceImg3 from "../../src/assets/img/service/03.jpg";
import serviceImg4 from "../../src/assets/img/service/04.jpg";

export default function Services() {
  return (
    <section className="service-section fix section-padding">
      <div className="container">
        <div className="section-title text-center mx-auto">
          <h6 className="wow fadeInUp">
            <img src={starIcon} alt="star" />
            Our Services
          </h6>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            We Don’t Build Hype.
            <div className="block-heading">
              We Build <b>Lasting</b> Brands.
            </div>
          </h2>
        </div>
        <div className="row">
          <div className="col-xl-6 wow fadeInUp" data-wow-delay=".2s">
            <div className="service-box-items">
              <div className="service-image">
                <img src={serviceImg1} alt="Video Marketing" />
              </div>
              <div className="service-content">
                <h3>Video Marketing</h3>
                <p>Scroll-stopping, high-performing content</p>
                <a href="service.html" className="link-btn">
                  more details{" "}
                  <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-xl-6 wow fadeInUp" data-wow-delay=".4s">
            <div className="service-box-items">
              <div className="service-image">
                <img src={serviceImg2} alt="Ads and SEO" />
              </div>
              <div className="service-content">
                <h3>Ads & SEO</h3>
                <p>Campaigns that convert + SEO that ranks</p>
                <a href="service.html" className="link-btn">
                  more details{" "}
                  <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-xl-6 wow fadeInUp" data-wow-delay=".6s">
            <div className="service-box-items">
              <div className="service-image">
                <img src={serviceImg3} alt="Website Development" />
              </div>
              <div className="service-content">
                <h3>Website Development</h3>
                <p>Custom, sleek, conversion-focused</p>
                <a href="service.html" className="link-btn">
                  more details{" "}
                  <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="col-xl-6 wow fadeInUp" data-wow-delay=".8s">
            <div className="service-box-items mb-0">
              <div className="service-image">
                <img src={serviceImg4} alt="Custom AI Solutions" />
              </div>
              <div className="service-content">
                <h3>Custom artificial solutions</h3>
                <p>
                  Duise sagettis rosend accumsas magna onest curos adipiscine
                  contacting the agency secondar
                </p>
                <a href="service.html" className="link-btn">
                  more details{" "}
                  <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
