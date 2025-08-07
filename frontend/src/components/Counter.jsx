import React from "react";

export default function Counter({
  end = 0,
  label,
  icon: Icon,
  displayText,
  prefix = "",
  suffix = "",
}) {
  return (
    <div className="counter-items wow fadeInUp">
      <div className="icon">
        {Icon && <Icon size={40} color="#ffffff" />}{" "}
        {/* yellow highlight, adjust as needed */}
      </div>
      <div className="content">
        <h2>
          {displayText
            ? displayText
            : `${prefix}${Number(end).toLocaleString()}${suffix}`}
        </h2>
        <p>{label}</p>
      </div>
    </div>
  );
}
