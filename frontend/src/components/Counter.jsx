import React from "react";

export default function Counter({
  end = 0,
  label,
  displayText,
  prefix = "",
  suffix = "",
}) {
  return (
    <div className="counter-items wow fadeInUp">
      <div className="content">
        <h2>
          {displayText ? (
            displayText
          ) : (
            <>
              {prefix}
              {Number(end).toLocaleString()}
              <span className="counter-suffix">{suffix}</span>
            </>
          )}
        </h2>
        <p>{label}</p>
      </div>
    </div>
  );
}
