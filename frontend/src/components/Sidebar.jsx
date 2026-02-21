// src/components/Sidebar.jsx

import React from "react";
import { motion } from "framer-motion";
import star3Icon from "../assets/img/star-3.png";
const SidebarWidget = ({ title, children }) => (
  <div className="single-sidebar-widget">
    <div className="wid-title">
      <h3>
        <img src={star3Icon} alt="star" />
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default function Sidebar({ headings }) {
  if (!headings?.length) return null;

  return (
    <div className="main-sidebar">
      <SidebarWidget title="Table of Contents">
        <motion.div
          className="toc-container pinned"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ul>
            {headings.map((heading) => (
              <motion.li
                key={heading.id}
                className={`toc-${heading.tagName}`}
                whileHover={{ scale: 1.05, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a href={`#${heading.id}`}>{heading.text}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </SidebarWidget>
    </div>
  );
}
