import React from "react";
import { Link } from "react-router-dom"; // Use Link for internal navigation

export default function NotFoundPage() {
  return (
    <section className="error-section section-padding style-padding fix">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="error-items">
              <div className="error-image wow fadeInUp">
                <img src="/assets/img/404.png" alt="404 error" />
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                Page not found
              </h2>
              <p className="wow fadeInUp" data-wow-delay=".5s">
                Sorry, we couldn't find your page.
              </p>
              {/* Use the <Link> component instead of an <a> tag */}
              <Link
                to="/"
                className="theme-btn wow fadeInUp"
                data-wow-delay=".7s"
              >
                Go Back Home
                <i className="fa-solid fa-arrow-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
