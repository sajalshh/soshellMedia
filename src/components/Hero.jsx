import React from "react";

export default function Hero() {
  return (
    <section
      className="hero-secton hero-1 bg-cover"
      style={{ backgroundImage: "url('/assets/img/hero/hero-bg-3.png')" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="hero-content">
              <div className="color-bg">
                <img src="/assets/img/hero/color-bg.png" alt="img" />
              </div>

              {/* This subtitle was also missing */}


              {/* The animation classes have been added back to the h1 tag */}
              <h1
                className="wow img-custom-anim-left"
                data-wow-duration="1.5s"
                data-wow-delay="0.1s"
              >
                We Don’t Just Post. <br />
                <span className="text-2">We Create </span>
                <span className="text-neon">Content</span>
                <span className="text-2"> That Converts.</span>
              </h1>
              <p className="sub">
                Performance-driven content studio for bold brands ready to
                scale, not settle.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="hero-image img-custom-anim-left bg-cover"
        style={{ backgroundImage: "url('/assets/img/hero/hero-1.png')" }}
      ></div>
    </section>
  );
}
