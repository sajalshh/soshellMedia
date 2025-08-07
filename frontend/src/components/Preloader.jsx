import React from "react";

export default function Preloader({ isLoading }) {
  // We return null if loading is finished, so the component is removed from the page.
  if (!isLoading) {
    return null;
  }

  return (
    <div id="preloader" className="preloader">
      <div className="animation-preloader">
        <div className="spinner"></div>
        <div className="txt-loading">
          <span data-text-preloader="A" className="letters-loading">
            A
          </span>
          <span data-text-preloader="I" className="letters-loading">
            I
          </span>
          <span data-text-preloader="F" className="letters-loading">
            F
          </span>
          <span data-text-preloader="O" className="letters-loading">
            O
          </span>
          <span data-text-preloader="R" className="letters-loading">
            R
          </span>
          <span data-text-preloader="G" className="letters-loading">
            G
          </span>
          <span data-text-preloader="E" className="letters-loading">
            E
          </span>
        </div>
        <p className="text-center">Loading</p>
      </div>
      <div className="loader">
        <div className="row">
          <div className="col-3 loader-section section-left">
            <div className="bg"></div>
          </div>
          <div className="col-3 loader-section section-left">
            <div className="bg"></div>
          </div>
          <div className="col-3 loader-section section-right">
            <div className="bg"></div>
          </div>
          <div className="col-3 loader-section section-right">
            <div className="bg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
