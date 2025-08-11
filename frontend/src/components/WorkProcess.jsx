import React from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import {
  FaSearch,
  FaPaintBrush,
  FaRocket,
  FaChartLine,
  FaFileAlt,
} from "react-icons/fa";


const processData = [
  {
    id: 1,
    icon: <FaSearch />,
    number: "01",
    title: "Discovery & Strategy",
    description:
      "We start by understanding your goals, audience, and challenges — then build a strategy that makes sense for your brand.",
  },
  {
    id: 2,
    icon: <FaPaintBrush />,
    number: "02",
    title: "Creative Development",
    description:
      "From video concepts to ad copy, our team crafts the ideas and assets that will resonate with your audience.",
  },
  {
    id: 3,
    icon: <FaRocket />,
    number: "03",
    title: "Execution",
    description:
      "We bring it all to life shooting scroll‑stopping videos, launching campaigns, building high‑performing websites.",
  },
  {
    id: 4,
    icon: <FaChartLine />,
    number: "04",
    title: "Optimization",
    description:
      "Nothing stays static. We track performance, analyze results, and fine‑tune to make every effort work harder.",
  },
  {
    id: 5,
    icon: <FaFileAlt />,
    number: "05",
    title: "Reporting & Growth",
    description:
      "We deliver clear, data‑driven insights so you can see what’s working — and how we’ll push your brand to the next level.",
  },
];

export default function WorkProcess() {
  return (
    <section
      className="work-process-section fix section-padding-2 bg-cover"
      style={{ backgroundImage: "url('assets/img/work-process-bg.jpg')" }}
    >
      <div className="container">
        <div className="section-title text-center">
          <Fade direction="up" triggerOnce>
            <img src="/assets/img/title-icon.png" alt="img" className="mb-3" />
          </Fade>
          <Fade direction="up" delay={300} triggerOnce>
            <h2 className="mb-3">
              Watch Your <b>Brand</b> Scale
            </h2>
          </Fade>
          <Fade direction="up" delay={500} triggerOnce>
            <p>Stories That Move Your Audience</p>
          </Fade>
        </div>
        <div className="row">
          
          {processData.slice(0, 3).map((item, index) => (
            <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
              <Fade direction="up" delay={200 * (index + 1)} triggerOnce>
                <div className="work-process-items">
                  <div className="icon">
                    {item.icon} 
                  </div>
                  <div className="number">{item.number}</div>
                  <div className="content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </Fade>
            </div>
          ))}
        </div>
        <div className="row justify-content-center">
          
          {processData.slice(3, 5).map((item, index) => (
            <div key={item.id} className="col-xl-4 col-lg-4 col-md-6">
              <Fade direction="up" delay={200 * (index + 1)} triggerOnce>
                <div className="work-process-items">
                  <div className="icon">
                    {item.icon} 
                  </div>
                  <div className="number">{item.number}</div>
                  <div className="content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </Fade>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
