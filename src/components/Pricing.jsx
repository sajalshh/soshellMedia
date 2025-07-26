import React from "react";

// A small reusable component for the checkmark SVG to keep the code clean
const Checkmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="12"
    viewBox="0 0 20 12"
    fill="none"
  >
    <path
      d="M10.3553 12C10.0508 12 9.84772 11.8857 9.64467 11.6571L5.38071 6.85714C4.97462 6.4 4.97462 5.71429 5.38071 5.25714C5.7868 4.8 6.39594 4.8 6.80203 5.25714L10.3553 9.25714L18.2741 0.342857C18.6802 -0.114286 19.2893 -0.114286 19.6954 0.342857C20.1015 0.8 20.1015 1.48571 19.6954 1.94286L11.066 11.6571C10.9645 11.8857 10.6599 12 10.3553 12Z"
      fill="#CDCDCD"
    />
    <path
      d="M5.27919 12C4.97462 12 4.77157 11.8857 4.56853 11.6571L0.304569 6.85714C-0.101523 6.4 -0.101523 5.71429 0.304569 5.25714C0.71066 4.8 1.3198 4.8 1.72589 5.25714L5.98985 10.0571C6.39594 10.5143 6.39594 11.2 5.98985 11.6571C5.88833 11.8857 5.58376 12 5.27919 12ZM10.6599 6.05714C10.3553 6.05714 10.1523 5.94286 9.94924 5.71429C9.54315 5.25714 9.54315 4.57143 9.94924 4.11429L13.198 0.342857C13.6041 -0.114286 14.2132 -0.114286 14.6193 0.342857C15.0254 0.8 15.0254 1.48571 14.6193 1.94286L11.3706 5.71429C11.1675 5.94286 10.9645 6.05714 10.6599 6.05714Z"
      fill="#CDCDCD"
    />
  </svg>
);

export default function Pricing() {
  return (
    <section className="pricing-section fix section-padding pt-0">
      <div className="container">
        <div className="section-title-area">
          <div className="section-title ml-200">
            <h6 className="wow fadeInUp">
              <img src="/assets/img/star.png" alt="img" /> popular package
            </h6>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Competitive package <br />
              <span>
                {" "}
                best AI <b>expertise</b>
              </span>
            </h2>
          </div>
          <ul className="nav">
            <li className="nav-item wow fadeInUp" data-wow-delay=".3s">
              <a href="#Annual" data-bs-toggle="tab" className="nav-link">
                Annual
              </a>
            </li>
            <li className="nav-item wow fadeInUp" data-wow-delay=".5s">
              <a
                href="#Monthly"
                data-bs-toggle="tab"
                className="nav-link active"
              >
                Monthly
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div id="Annual" className="tab-pane fade">
            {/* Annual pricing content can be copied from the monthly one and adjusted */}
          </div>
          <div id="Monthly" className="tab-pane fade show active">
            <div className="row">
              <div
                className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay=".2s"
              >
                <div className="pricing-box-items">
                  <div className="icon">
                    <img src="/assets/img/icon/02.svg" alt="img" />
                  </div>
                  <div className="pricing-header">
                    <h3>Standard</h3>
                    <p>Ideal for personal project</p>
                    <h2>$25</h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <Checkmark />
                      <span>Access AI tool</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Exclusive feature</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>24/7 support</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Discord access</span>
                    </li>
                  </ul>
                  <div className="pricing-button">
                    <a href="pricing.html" className="theme-btn">
                      Start Now{" "}
                      <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay=".4s"
              >
                <div className="pricing-box-items">
                  <div className="icon">
                    <img src="/assets/img/icon/02.svg" alt="img" />
                  </div>
                  <div className="pricing-header">
                    <h3>Professional</h3>
                    <p>Ideal for personal project</p>
                    <h2>$29</h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <Checkmark />
                      <span>Access AI tool</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Exclusive feature</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>24/7 support</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Discord access</span>
                    </li>
                  </ul>
                  <div className="pricing-button">
                    <a href="pricing.html" className="theme-btn">
                      Start Now{" "}
                      <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay=".6s"
              >
                <div className="pricing-box-items">
                  <div className="icon">
                    <img src="/assets/img/icon/02.svg" alt="img" />
                  </div>
                  <div className="pricing-header">
                    <h3>Business</h3>
                    <p>Ideal for personal project</p>
                    <h2>$49</h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <Checkmark />
                      <span>Access AI tool</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Exclusive feature</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>24/7 support</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Discord access</span>
                    </li>
                  </ul>
                  <div className="pricing-button">
                    <a href="pricing.html" className="theme-btn">
                      Start Now{" "}
                      <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay=".8s"
              >
                <div className="pricing-box-items">
                  <div className="icon">
                    <img src="/assets/img/icon/02.svg" alt="img" />
                  </div>
                  <div className="pricing-header">
                    <h3>Enterprise</h3>
                    <p>Ideal for personal project</p>
                    <h2>$54</h2>
                  </div>
                  <ul className="pricing-list">
                    <li>
                      <Checkmark />
                      <span>Access AI tool</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Exclusive feature</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>24/7 support</span>
                    </li>
                    <li>
                      <Checkmark />
                      <span>Discord access</span>
                    </li>
                  </ul>
                  <div className="pricing-button">
                    <a href="pricing.html" className="theme-btn">
                      Start Now{" "}
                      <i className="fa-sharp fa-regular fa-arrow-up-right"></i>
                    </a>
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
