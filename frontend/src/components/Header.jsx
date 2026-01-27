import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Menu, X } from "lucide-react";

// --- Navigation Links Data (used for both mobile and desktop) ---
const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/service", label: "Services" },
  { path: "/project", label: "Portfolio" },
  { path: "/blog", label: "Blog" },
  { path: "/casestudies", label: "Case Studies" },
  { path: "/pricing", label: "Pricing" },
];

// --- Desktop Navigation ---
const DesktopNav = () => {
  const location = useLocation();
  return (
    <nav className="tw-hidden lg:tw-flex">
      <ul className="tw-flex tw-items-center tw-gap-8">
        {navLinks.map((link) => (
          <li key={link.path} className="tw-relative">
            <Link
              to={link.path}
              className="tw-font-medium tw-text-white hover:tw-text-[var(--tp-theme-primary)] tw-transition-colors"
            >
              {link.label}
            </Link>

            {/* Active link underline animation */}
            {location.pathname === link.path && (
              <motion.span
                className="tw-absolute -tw-bottom-2 tw-left-0 tw-right-0 tw-h-0.5 tw-bg-[var(--tp-theme-primary)]"
                layoutId="underline"
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// --- Mobile Navigation (Full-Screen Overlay) ---
const MobileNav = ({ closeMenu }) => {
  return (
    <motion.div
      className="tw-fixed tw-inset-0 tw-bg-black/90 tw-backdrop-blur-lg tw-z-[9999] lg:tw-hidden"
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: "0%" }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="tw-container tw-h-full tw-flex tw-flex-col tw-justify-center">
        <nav>
          <motion.ul
            className="tw-text-center"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.li
                key={link.path}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to={link.path}
                  onClick={closeMenu}
                  className="tw-block tw-py-4 tw-text-3xl tw-font-semibold tw-text-white hover:tw-text-[var(--tp-theme-primary)]"
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
      </div>
    </motion.div>
  );
};

// --- Main Header Component ---
export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect scroll for sticky header
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header
        className={`tw-fixed tw-top-0 tw-left-0 tw-w-full tw-z-[9998] tw-transition-all tw-duration-300 ${
          isSticky
            ? "tw-py-4 tw-bg-black/50 tw-backdrop-blur-lg tw-shadow-lg"
            : "tw-py-6 tw-bg-black/30 lg:tw-bg-transparent"
        }`}
      >
        <div className="container-fluid">
          <div className="tw-flex tw-items-center tw-justify-between">
            {/* --- Logo --- */}
            <div className="logo">
              <Link to="/" className="header-logo">
                <img
                  src="/assets/img/logo/header.png"
                  alt="header-logo"
                  style={{ width: "184px", height: "auto" }}
                />
              </Link>
            </div>

            {/* --- Desktop Navigation --- */}
            <div className="tw-absolute tw-left-1/2 -tw-translate-x-1/2">
              <DesktopNav />
            </div>

            {/* --- Right Side --- */}
            <div className="tw-flex tw-items-center tw-gap-6 lg:tw-mr-6">
              {/* Hidden on Mobile */}
              <Link
                to="/appointment"
                className="theme-btn contact-btn !tw-hidden lg:!tw-inline-flex lg:tw-items-center lg:tw-gap-2.5"
              >
                <Mail size={18} />
                <span>Book Appointment</span>
              </Link>

              {/* Hamburger Button */}
              <button
                onClick={toggleMobileMenu}
                className="tw-z-[10000] tw-text-white lg:tw-hidden"
                aria-label="Toggle menu"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? "x" : "menu"}
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav closeMenu={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
