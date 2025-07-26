import React, { useState } from "react";
import { Fade } from "react-awesome-reveal";
// A small reusable component for the pricing features
const PricingCard = ({ plan, price, isPopular = false }) => (
  <div className={`pricing-box-items ${isPopular ? "popular" : ""}`}>
    <div className="icon">
      <img src="/assets/img/icon/02.svg" alt="img" />
    </div>
    <div className="pricing-header">
      <h3>{plan}</h3>
      <p>Ideal for personal project</p>
      <h2>${price}</h2>
    </div>
    <ul className="pricing-list">
      <li>...Feature list...</li>
    </ul>
    <div className="pricing-button">
      <a href="pricing.html" className="theme-btn">
        Start Now <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
      </a>
    </div>
  </div>
);

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' or 'annual'

  return (
    <section className="pricing-section style-padding fix section-padding">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title ml-200">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> popular package
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                Competitive package <br />
                <span>
                  {" "}
                  best AI <b>expertise</b>
                </span>
              </h2>
            </Fade>
          </div>
          <ul className="nav">
            <li className="nav-item">
              <a
                href="#Annual"
                onClick={(e) => {
                  e.preventDefault();
                  setBillingCycle("annual");
                }}
                className={`nav-link ${
                  billingCycle === "annual" ? "active" : ""
                }`}
              >
                Annual
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#Monthly"
                onClick={(e) => {
                  e.preventDefault();
                  setBillingCycle("monthly");
                }}
                className={`nav-link ${
                  billingCycle === "monthly" ? "active" : ""
                }`}
              >
                Monthly
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div
            className={`tab-pane fade ${
              billingCycle === "monthly" ? "show active" : ""
            }`}
          >
            <div className="row">
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Standard" price="25" />
              </div>
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Professional" price="29" isPopular={true} />
              </div>
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Business" price="49" />
              </div>
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Enterprise" price="54" />
              </div>
            </div>
          </div>
          <div
            className={`tab-pane fade ${
              billingCycle === "annual" ? "show active" : ""
            }`}
          >
            <div className="row">
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Standard" price="250" />
              </div>
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Professional" price="290" isPopular={true} />
              </div>
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Business" price="490" />
              </div>
              <div className="col-md-6 col-lg-4 col-xl-3">
                <PricingCard plan="Enterprise" price="540" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
