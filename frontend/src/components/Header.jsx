import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Menu, X, ArrowRight } from "lucide-react";

// --- Navigation Links Data ---
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
          <li key={link.path} className="tw-relative tw-group">
            <Link
              to={link.path}
              className={`tw-font-medium tw-transition-colors tw-duration-300 ${
                location.pathname === link.path
                  ? "tw-text-[var(--tp-theme-primary)]"
                  : "tw-text-white hover:tw-text-[var(--tp-theme-primary)]"
              }`}
            >
              {link.label}
            </Link>
            {/* Active link underline animation */}
            {location.pathname === link.path && (
              <motion.span
                className="tw-absolute -tw-bottom-2 tw-left-0 tw-right-0 tw-h-[2px] tw-bg-[var(--tp-theme-primary)] tw-rounded-full"
                layoutId="underline"
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// --- Mobile Navigation (Modern Glassmorphism Drawer) ---
const MobileNav = ({ closeMenu }) => {
  const location = useLocation();

  return (
    <motion.div
      className="tw-fixed tw-inset-0 tw-bg-[#0a0a0c]/80 tw-backdrop-blur-xl tw-z-[9997] lg:tw-hidden tw-flex tw-flex-col"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: "0%" }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <div className="tw-flex-1 tw-overflow-y-auto tw-pt-24 tw-px-6 tw-pb-8 tw-flex tw-flex-col">
        <nav className="tw-flex-1">
          <motion.ul
            className="tw-flex tw-flex-col tw-gap-2"
            variants={{
              visible: {
                transition: { staggerChildren: 0.05, delayChildren: 0.1 },
              },
              hidden: {
                transition: { staggerChildren: 0.03, staggerDirection: -1 },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.li
                  key={link.path}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    to={link.path}
                    onClick={closeMenu}
                    className={`tw-flex tw-items-center tw-justify-between tw-py-4 tw-px-4 tw-rounded-xl tw-text-xl tw-font-semibold tw-transition-all ${
                      isActive
                        ? "tw-bg-[var(--tp-theme-primary)]/10 tw-text-[var(--tp-theme-primary)]"
                        : "tw-text-white hover:tw-bg-white/5"
                    }`}
                  >
                    {link.label}
                    {isActive && <ArrowRight size={20} />}
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>

        {/* Mobile CTA - Crucial for conversions */}
        <motion.div
          className="tw-mt-8 tw-pt-8 tw-border-t tw-border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/appointment"
            onClick={closeMenu}
            className="tw-w-full tw-py-4 tw-bg-[var(--tp-theme-primary)] tw-text-black tw-rounded-full tw-font-bold tw-flex tw-items-center tw-justify-center tw-gap-2 hover:tw-scale-[1.02] tw-transition-transform"
          >
            <Mail size={18} />
            <span>Book Appointment</span>
          </Link>
        </motion.div>
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
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      <header
        className={`tw-fixed tw-top-0 tw-left-0 tw-w-full tw-z-[9998] tw-transition-all tw-duration-300 ${
          isSticky
            ? "tw-py-3 lg:tw-py-4 tw-bg-[#0f0f11]/80 tw-backdrop-blur-md tw-shadow-[0_4px_30px_rgba(0,0,0,0.5)] tw-border-b tw-border-white/5"
            : "tw-py-4 lg:tw-py-6 tw-bg-transparent"
        }`}
      >
        <div className="container-fluid">
          <div className="tw-flex tw-items-center tw-justify-between">
            {/* --- Logo --- */}
            <div className="logo tw-relative tw-z-[10000]">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/assets/img/logo/header.png"
                  alt="Soshell Media"
                  className="tw-w-[130px] sm:tw-w-[150px] lg:tw-w-[184px] tw-h-auto tw-transition-all"
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

              {/* Hamburger Button (Modernized) */}
              <button
                onClick={toggleMobileMenu}
                className="tw-relative tw-z-[10000] tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-white/5 tw-border tw-border-white/10 tw-text-white lg:tw-hidden hover:tw-bg-white/10 tw-transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={isMobileMenuOpen ? "x" : "menu"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileNav closeMenu={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
