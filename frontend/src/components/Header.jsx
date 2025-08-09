import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

// 1. Updated NavLinks to accept a 'closeMenu' function
const NavLinks = ({ closeMenu }) => (
  <nav id="mobile-menu">
    <ul>
      {/* 2. Added onClick={closeMenu} to every link */}
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
                    <img src="/assets/img/logo/white-logo.svg" alt="logo-img" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <div className="mobile-menu fix mb-3">
                {/* 3. We pass the function down to the component here */}
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
                    {/* The desktop menu doesn't need the close function */}
                    <NavLinks closeMenu={() => {}} />
                  </div>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                {/* 2. Updated "Contact Us" link */}
                <Link to="/contact" className="theme-btn contact-btn">
                  <FaEnvelope />
                  <span>Contact Us</span>
                </Link>

                {/* 3. Magnifying glass button has been removed */}

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

      <div className={`search-wrap ${isSearchOpen ? "open" : ""}`}>
        <div className="search-inner">
          <i
            className="fas fa-times search-close"
            id="search-close"
            onClick={() => setIsSearchOpen(false)}
          ></i>
          <div className="search-cell">
            <form method="get">
              <div className="search-field-holder">
                <input
                  type="search"
                  className="main-search-input"
                  placeholder="Search..."
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
