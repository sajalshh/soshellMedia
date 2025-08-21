// src/components/Modal.jsx

import React from "react";
import { Fade } from "react-awesome-reveal";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    // The semi-transparent background overlay
    <div className="modal-overlay">
      <Fade direction="up" duration={300} triggerOnce>
        {/* The actual modal content box */}
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close-btn" onClick={onClose}>
              &times; {/* This is a simple 'X' icon */}
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </Fade>
    </div>
  );
}
