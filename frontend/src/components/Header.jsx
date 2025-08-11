import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa"; 

const NavLinks = ({ closeMenu }) => (
  <nav id="mobile-menu">
    <ul>
      <li>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={closeMenu}>
          About Us
        </Link>
      </li>
      <li>
        <Link to="/service" onClick={closeMenu}>
          Services
        </Link>
      </li>
      <li>
        <Link to="/news" onClick={closeMenu}>
          Blog
        </Link>
      </li>
      <li>
        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>
      </li>
    </ul>
  </nav>
);

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="fix-area">
        <div className={`offcanvas__info ${isSidebarOpen ? "info-open" : ""}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link to="/" onClick={() => setIsSidebarOpen(false)}>
                    <img src="/assets/img/logo/logo.png" alt="logo-img" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="mobile-menu fix mb-3">
                <NavLinks closeMenu={() => setIsSidebarOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay ${isSidebarOpen ? "overlay-open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <header
        id="header-sticky"
        className={`header-1 ${isSticky ? "sticky" : ""}`}
      >
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main">
              <div className="header-left">
                <div className="logo">
                  <Link to="/" className="header-logo">
                    <img
                      src="/assets/img/logo/header.png"
                      alt="header-logo"
                      style={{ width: "184px", height: "68px" }}
                    />
                  </Link>
                </div>
                <div className="mean__menu-wrapper">
                  <div className="main-menu">
                    <NavLinks closeMenu={() => {}} />
                  </div>
                </div>
              </div>

              {/* top-right section */}
              <div className="header-right d-flex justify-content-end align-items-center">
                {/* 1. "Contact Us" button for desktop */}
                <Link to="/contact" className="theme-btn contact-btn">
                  <FaEnvelope />
                  <span>Contact Us</span>
                </Link>

                {/* Icon for mobile */}
                <div className="header__hamburger d-xl-block my-auto">
                  <div
                    className="sidebar__toggle"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <i className="fas fa-bars"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
