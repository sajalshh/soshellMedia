import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  // State for the sticky header
  const [isSticky, setIsSticky] = useState(false);
  // State for the search popup
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // State for the off-canvas sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State to manage which dropdown menu is open on hover
  const [openDropdown, setOpenDropdown] = useState(null);

  // Effect for handling the sticky header on scroll
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
      {/* Offcanvas Area Start (controlled by isSidebarOpen state) */}
      <div className="fix-area">
        <div className={`offcanvas__info ${isSidebarOpen ? "info-open" : ""}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link to="/">
                    <img src="/assets/img/logo/white-logo.svg" alt="logo-img" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <p className="text d-none d-xl-block">
                Nullam dignissim, ante scelerisque the is euismod fermentum odio
                sem semper the is erat, a feugiat leo urna eget eros. Duis
                Aenean a imperdiet risus.
              </p>
              <div className="mobile-menu fix mb-3"></div>
              <div className="offcanvas__contact">
                <h4>Contact Info</h4>
                {/* Contact info list can be populated here */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay ${isSidebarOpen ? "overlay-open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Header Section Start (className is now dynamic for sticky effect) */}
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
                      alt="header"
                      style={{ width: "184px", height: "68px" }}
                    />
                  </Link>
                </div>
                <div className="mean__menu-wrapper">
                  <div className="main-menu">
                    <nav id="mobile-menu">
                      <ul>
                        <li
                          className="has-dropdown"
                          onMouseEnter={() => setOpenDropdown("home")}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <Link to="/">Home</Link>
                        </li>
                        <li>
                          <Link to="/about">About Us</Link>
                        </li>
                        <li
                          className="has-dropdown"
                          onMouseEnter={() => setOpenDropdown("pages")}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <a href="/#" onClick={(e) => e.preventDefault()}>
                            Pages
                          </a>
                          <ul
                            className={`submenu ${
                              openDropdown === "pages" ? "show-dropdown" : ""
                            }`}
                          >
                            <li>
                              <Link to="/service">Services</Link>
                            </li>
                            <li>
                              <Link to="/team">Team</Link>
                            </li>
                            <li>
                              <Link to="/project">Portfolio</Link>
                            </li>
                            <li>
                              <Link to="/pricing">Pricing</Link>
                            </li>
                            <li>
                              <Link to="/faq">Our Faq</Link>
                            </li>
                            <li>
                              <Link to="/login">Login</Link>
                            </li>
                          </ul>
                        </li>
                        <li
                          className="has-dropdown"
                          onMouseEnter={() => setOpenDropdown("blog")}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <Link to="/news">Blog</Link>
                          <ul
                            className={`submenu ${
                              openDropdown === "blog" ? "show-dropdown" : ""
                            }`}
                          >
                            <li>
                              <Link to="/news">Blog</Link>
                            </li>
                            <li>
                              <Link to="/news-details/1">Blog Details</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link to="/contact">Contact</Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="header-right d-flex justify-content-end align-items-center">
                <Link to="/login" className="join-text">
                  <img src="/assets/img/discord.svg" alt="img" /> Join now
                </Link>
                <a
                  href="#0"
                  className="search-trigger search-icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <i className="fa-regular fa-magnifying-glass"></i>
                </a>
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

      {/* Search Area Start (className is dynamic for open/close) */}
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
