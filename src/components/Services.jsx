import React from "react";

export default function Services() {
  return (
    <section className="service-section fix section-padding">
      <div className="container">
        <div className="section-title text-center">
          <h6 className="wow fadeInUp">
            <img src="/assets/img/star.png" alt="img" />
            Our Services
          </h6>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            We Don’t Build Hype. <br />
            <span>
              We Build <b>Lasting</b> Brands.
            </span>
          </h2>
        </div>
        <div className="row">
          <div className="col-xl-6 wow fadeInUp" data-wow-delay=".2s">
            <div className="service-box-items">
              <div className="service-image">
                <img src="/assets/img/service/01.jpg" alt="img" />
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
                <img src="/assets/img/service/02.jpg" alt="img" />
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
                <img src="/assets/img/service/03.jpg" alt="img" />
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
                <img src="/assets/img/service/04.jpg" alt="img" />
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
