import React from "react";
// 1. Import the new FaBullhorn icon
import { FaEye, FaHandshake, FaVideo, FaBullhorn } from "react-icons/fa";
import Counter from "./Counter";

export default function AboutPage() {
  return (
    <>
      <section className="counter1">
        <div className="counter-section section-padding pb-0">
          <div className="container">
            <div className="counter-wrapper counter-one">
              <Counter end={250} suffix="M+" label="Views Generated" />
              <Counter end={6} suffix="+" label="Growth Experience" />
              <Counter end={5000} suffix="+" label="Videos Created" />
              <Counter end={300} suffix="+" label="Campaigns Delivered" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
