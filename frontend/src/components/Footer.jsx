import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import footerLogo from "../../src/assets/img/logo/logo.png";
// Same links as Navbar
const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/service", label: "Services" },
  { path: "/project", label: "Portfolio" },
  { path: "/blog", label: "Blog" },
  { path: "/casestudies", label: "Case Studies" },
  { path: "/contact", label: "Contact" },
];

// Footer services
const serviceLinks = [
  { path: "/service", label: "AI Avatar" },
  { path: "/service", label: "Video Editing" },
  { path: "/service", label: "SEO & Optimization" },
  { path: "/service", label: "Performance Marketing" },
  { path: "/service", label: "AI Calling Agents" },
];

export default function Footer() {
  return (
    <footer className="footer-section footer-bg tw-relative tw-overflow-hidden">
      {/* Top Part */}
      <div className="container tw-py-16">
        <div className="row tw-gap-y-10">
          {/* Logo + About */}
          <div className="col-xl-4 col-lg-4 col-md-6">
            <div className="single-footer-widget">
              <div className="footer-content">
                <Link to="/" className="tw-inline-block">
                  <img
                    src={footerLogo}
                    alt="Soshell Media"
                    style={{ width: "164px", height: "62px" }}
                  />
                </Link>

                <p className="tw-mt-4 tw-text-white/70 tw-leading-relaxed">
                  Soshell Media helps brands grow with modern design,
                  development, and marketing solutions. We build experiences
                  that look premium and perform better.
                </p>

                {/* Social Icons */}
                <div className="tw-mt-5 tw-flex tw-items-center tw-gap-3">
                  <a
                    href="#"
                    className="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-white/10 hover:tw-bg-[var(--tp-theme-primary)] tw-transition"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} className="tw-text-white" />
                  </a>

                  <a
                    href="#"
                    className="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-white/10 hover:tw-bg-[var(--tp-theme-primary)] tw-transition"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={18} className="tw-text-white" />
                  </a>

                  <a
                    href="#"
                    className="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-white/10 hover:tw-bg-[var(--tp-theme-primary)] tw-transition"
                    aria-label="Twitter"
                  >
                    <Twitter size={18} className="tw-text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-xl-2 col-lg-4 col-md-6">
            <div className="single-footer-widget">
              <div className="widget-head">
                <h3 className="tw-text-white">Quick Links</h3>
              </div>

              <ul className="list-items tw-mt-4 tw-space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="tw-text-white/70 hover:tw-text-[var(--tp-theme-primary)] tw-transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services */}
          <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="single-footer-widget">
              <div className="widget-head">
                <h3 className="tw-text-white">Services</h3>
              </div>

              <ul className="list-items tw-mt-4 tw-space-y-2">
                {serviceLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="tw-text-white/70 hover:tw-text-[var(--tp-theme-primary)] tw-transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-xl-3 col-lg-4 col-md-6">
            <div className="single-footer-widget">
              <div className="widget-head">
                <h3 className="tw-text-white">Contact</h3>
              </div>

              <div className="tw-mt-4 tw-space-y-4">
                <div className="tw-flex tw-items-start tw-gap-3">
                  <MapPin
                    size={18}
                    className="tw-text-[var(--tp-theme-primary)] tw-mt-1"
                  />
                  <p className="tw-text-white/70 tw-leading-relaxed">
                    Windsor, Ontario, Canada
                  </p>
                </div>

                <div className="tw-flex tw-items-center tw-gap-3">
                  <Phone
                    size={18}
                    className="tw-text-[var(--tp-theme-primary)]"
                  />
                  <a
                    href="tel:+10000000000"
                    className="tw-text-white/70 hover:tw-text-[var(--tp-theme-primary)] tw-transition"
                  >
                    +1 (647) 897-0671
                  </a>
                </div>

                <div className="tw-flex tw-items-center tw-gap-3">
                  <Mail
                    size={18}
                    className="tw-text-[var(--tp-theme-primary)]"
                  />
                  <a
                    href="mailto:hello@soshellmedia.com"
                    className="tw-text-white/70 hover:tw-text-[var(--tp-theme-primary)] tw-transition"
                  >
                    info@soshellmedia.com
                  </a>
                </div>

                {/* CTA Button */}
                <Link
                  to="/appointment"
                  className="theme-btn contact-btn tw-mt-2 !tw-inline-flex tw-items-center tw-gap-2.5"
                >
                  <Mail size={18} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="footer-bottom tw-border-t tw-border-white/10">
        <div className="container">
          <div className="footer-bottom-wrapper tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-between tw-gap-4 tw-py-6">
            <p className="tw-text-white/60 tw-text-sm tw-text-center md:tw-text-left">
              Soshell Media © {new Date().getFullYear()}. All Rights Reserved.
            </p>
            <div className="tw-flex tw-items-center tw-gap-5 tw-text-sm">
              <Link
                to="/privacy"
                className="tw-text-white/60 hover:tw-text-[var(--tp-theme-primary)] tw-transition"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="tw-text-white/60 hover:tw-text-[var(--tp-theme-primary)] tw-transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
