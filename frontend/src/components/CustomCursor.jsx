import React, { useState, useEffect } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Update cursor position
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Detect when hovering over interactive elements
    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, .cursor-pointer")) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);

    // Cleanup listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      <div
        className={`mouse-cursor cursor-outer ${
          isHovering ? "cursor-hover" : ""
        }`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      ></div>
      <div
        className={`mouse-cursor cursor-inner ${
          isHovering ? "cursor-hover" : ""
        }`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      ></div>
    </>
  );
}
