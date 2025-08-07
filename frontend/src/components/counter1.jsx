import React from "react";
import { FaEye, FaHandshake, FaVideo } from "react-icons/fa"; 
import Counter from "./Counter";

export default function AboutPage() {
  return (
    <>
      <section className="counter1">
        <div className="counter-section section-padding pb-0">
          <div className="container">
            <div className="counter-wrapper counter-one">
              <Counter
                end={250}
                suffix="M+"
                label="Views Generated"
                icon={FaEye}
              />
              <Counter
                end={6}
                suffix="+ years"
                label="Growth Partner"
                icon={FaHandshake}
              />
              <Counter
                end={5000}
                suffix="+"
                label="Videos Created"
                icon={FaVideo}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
