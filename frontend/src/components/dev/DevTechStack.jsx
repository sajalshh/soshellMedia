import React from "react";
import { Fade } from "react-awesome-reveal";
import TechIcon from "./techIcons";

const TechChip = ({ tech }) => (
  <div className="dev-tech-chip">
    <div className="dev-tech-chip-icon">
      <TechIcon iconKey={tech.iconKey} size={28} />
    </div>
    <span className="dev-tech-chip-label">{tech.name}</span>
  </div>
);

const MarqueeRow = ({ label, items, direction = "left", speed = 32 }) => {
  if (items.length === 0) return null;
  // Duplicated once so the strip can loop seamlessly at exactly -50%.
  const looped = [...items, ...items];

  return (
    <div className="dev-marquee-row">
      <p className="dev-tech-group-label">{label}</p>
      <div className="dev-marquee-mask">
        <div
          className={`dev-marquee-track dev-marquee-${direction}`}
          style={{ "--dev-marquee-duration": `${speed}s` }}
        >
          {looped.map((tech, i) => (
            <TechChip key={`${tech._id || tech.name}-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function DevTechStack({ technologies = [], title, subtitle }) {
  if (technologies.length === 0) return null;

  const platformsAndFrameworks = technologies.filter(
    (t) => t.category === "Platforms" || t.category === "Frameworks",
  );
  const languagesAndTools = technologies.filter(
    (t) => t.category === "Languages" || t.category === "Tools",
  );

  return (
    <section className="dev-tech-section section-padding-2 fix">
      <div className="container">
        <div className="section-title text-center mx-auto">
          <Fade direction="up" triggerOnce>
            <h6>
              <span className="dev-star">✦</span> what we build with
            </h6>
          </Fade>
          <Fade direction="up" delay={200} triggerOnce>
            <h2>
              {title || "Our Tech Stack"}
              <br />
              <span className="text-neon">
                {subtitle || "Platforms & Tools We Build With"}
              </span>
            </h2>
          </Fade>
        </div>
      </div>

      <div className="tw-mt-12 tw-flex tw-flex-col tw-gap-10">
        <MarqueeRow
          label="Platforms & Frameworks"
          items={platformsAndFrameworks}
          direction="left"
          speed={30}
        />
        <MarqueeRow
          label="Languages & Tools"
          items={languagesAndTools}
          direction="right"
          speed={34}
        />
      </div>

      <style>{`
        .dev-tech-section { position: relative; }

        .dev-star {
          color: var(--tp-theme-primary);
          margin-right: 4px;
        }

        .dev-tech-group-label {
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 13px;
          font-weight: 700;
          color: var(--tp-theme-primary);
          margin-bottom: 16px;
          text-align: center;
        }

        .dev-marquee-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }

        .dev-marquee-track {
          display: flex;
          width: max-content;
          gap: 16px;
          animation-duration: var(--dev-marquee-duration, 30s);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .dev-marquee-track:hover {
          animation-play-state: paused;
        }

        .dev-marquee-left {
          animation-name: devMarqueeLeft;
        }

        .dev-marquee-right {
          animation-name: devMarqueeRight;
        }

        @keyframes devMarqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes devMarqueeRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .dev-tech-chip {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 22px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: default;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .dev-tech-chip:hover {
          border-color: rgba(3, 220, 176, 0.55);
          background: rgba(3, 220, 176, 0.06);
          box-shadow: 0 12px 30px rgba(0, 255, 204, 0.12);
        }

        .dev-tech-chip-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dev-tech-chip-label {
          font-size: 14px;
          font-weight: 600;
          color: #cdcdcd;
          white-space: nowrap;
        }

        @media (max-width: 575px) {
          .dev-tech-chip {
            padding: 12px 16px;
            gap: 9px;
          }
          .dev-tech-chip-icon {
            width: 24px;
            height: 24px;
          }
          .dev-tech-chip-label {
            font-size: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dev-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
