import React from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Rosa Compton",
      title: "Creative Designer",
      imgSrc: "/assets/img/team/01.jpg",
    },
    {
      name: "Clifford Barron",
      title: "Chief Executive",
      imgSrc: "/assets/img/team/02.jpg",
    },
    {
      name: "Shikhon Islam",
      title: "Project Manager",
      imgSrc: "/assets/img/team/03.jpg",
    },
    {
      name: "Ritu Islam",
      title: "Chief Engineer",
      imgSrc: "/assets/img/team/04.jpg",
    },
    {
      name: "Belinda Hellers",
      title: "Creative Designer",
      imgSrc: "/assets/img/team/05.jpg",
    },
    {
      name: "Dorisde Wellas",
      title: "Chief Executive",
      imgSrc: "/assets/img/team/06.jpg",
    },
    {
      name: "Florence Craig",
      title: "Project Manager",
      imgSrc: "/assets/img/team/07.jpg",
    },
    {
      name: "Marty Dockery",
      title: "Chief Engineer",
      imgSrc: "/assets/img/team/08.jpg",
    },
  ];

  return (
    <>
      {/* Breadcrumb Section */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: "url('/assets/img/breadcrumb-bg.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> dedicated member
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h1>
                Our <span>Team</span>
              </h1>
            </Fade>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <section
        className="team-section fix style-padding section-padding bg-cover"
        style={{ backgroundImage: "url('/assets/img/team/team-bg.jpg')" }}
      >
        <div className="container">
          <div className="section-title ml-200">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src="/assets/img/star.png" alt="img" /> dedicated excutive
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h2>
                Expert innovating <br />
                <span>
                  AI <b>driven visual</b> solutions
                </span>
              </h2>
            </Fade>
          </div>
          <div className="row">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <Fade direction="up" delay={index * 200} triggerOnce>
                  <div className="team-box-items">
                    <div className="team-image">
                      <img src={member.imgSrc} alt={member.name} />
                      <div className="social-profile">
                        <ul>
                          <li>
                            <a href="#">
                              <i className="fa-brands fa-discord"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa-brands fa-facebook-f"></i>
                            </a>
                          </li>
                        </ul>
                        <span className="plus-btn">
                          <i className="fas fa-share-alt"></i>
                        </span>
                      </div>
                    </div>
                    <div className="team-content">
                      <h3>{member.name}</h3>
                      <p>{member.title}</p>
                    </div>
                  </div>
                </Fade>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section section-padding fix section-bg pb-0">
        <div className="container">
          <div className="testimonial-wrapper-3">
            <div className="row g-4">
              <div className="col-xl-5 col-lg-6">
                <Fade direction="left" triggerOnce>
                  <div className="testimonial-image">
                    <img src="/assets/img/testimonial/01.jpg" alt="img" />
                  </div>
                </Fade>
              </div>
              <div className="col-xl-7 col-lg-6">
                <Swiper className="testimonial-slider-3" loop={true}>
                  <SwiperSlide>
                    <div className="testimonial-content">
                      {/* Testimonial content */}
                      <h3>
                        Potenti might turpis dictumst ridiculus pellentesque
                        molestie consequat at egestas eleifend nisle montes
                        duis...
                      </h3>
                      <div className="author-items">
                        <div className="image">
                          <img
                            src="/assets/img/testimonial/client-10.jpg"
                            alt="img"
                          />
                        </div>
                        <div className="content">
                          <h3>Fredrick Grace</h3>
                          <span>sr. executive</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial-content">
                      {/* Testimonial content */}
                      <h3>
                        Potenti might turpis dictumst ridiculus pellentesque
                        molestie consequat at egestas eleifend nisle montes
                        duis...
                      </h3>
                      <div className="author-items">
                        <div className="image">
                          <img
                            src="/assets/img/testimonial/client-10.jpg"
                            alt="img"
                          />
                        </div>
                        <div className="content">
                          <h3>Fredrick Grace</h3>
                          <span>sr. executive</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
