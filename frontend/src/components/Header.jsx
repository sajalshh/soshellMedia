import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// A reusable component for the navigation links
// This prevents repeating code and makes updates easier
const NavLinks = () => (
  <nav id="mobile-menu">
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About Us</Link>
      </li>
      <li>
       <Link to="/service">Services</Link>
      </li>
      <li className="has-dropdown">
        <Link to="/news">Blog</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
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
      {/* =====================================================
        Off-Canvas Sidebar for Mobile Menu
        =====================================================
      */}
      
      <div
        className={`offcanvas__overlay ${isSidebarOpen ? "overlay-open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* =====================================================
        Main Header for Desktop
        =====================================================
      */}
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
                  {/* Desktop navigation links are rendered here */}
                  <div className="main-menu">
                    <NavLinks />
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
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSearchOpen(true);
                  }}
                >
                  <i className="fa-regular fa-magnifying-glass"></i>
                </a>

                {/* Hamburger Icon - only visible on mobile via CSS */}
                
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
        Search Popup Area
        =====================================================
      */}
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
