import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { Search, PenTool, Code2, ShieldCheck, Rocket } from "lucide-react";

// Cycled by index so any number of steps still gets a sensible icon.
const STEP_ICONS = [Search, PenTool, Code2, ShieldCheck, Rocket];

const ProcessNode = ({ number, title, description, index, Icon }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`dev-timeline-item ${isEven ? "dev-timeline-item-left" : "dev-timeline-item-right"}`}>
      <div className="dev-timeline-node">
        <Icon size={20} />
      </div>

      <motion.div
        className="dev-timeline-card"
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="dev-timeline-ghost-number">
          {String(number).padStart(2, "0")}
        </span>
        <h3>{title}</h3>
        <p>{description}</p>
      </motion.div>
    </div>
  );
};

export default function DevProcess({ steps = [], title, subtitle }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 75%", "end 60%"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (steps.length === 0) return null;

  return (
    <section ref={targetRef} className="dev-process-section section-padding-2 fix">
      <div className="container">
        <div className="section-title text-center mx-auto">
          <Fade direction="up" triggerOnce>
            <h6>
              <span className="dev-star">✦</span> our workflow
            </h6>
          </Fade>
          <Fade direction="up" delay={200} triggerOnce>
            <h2>
              {title || "How We Work"}
              <br />
              <span className="text-neon">
                {subtitle || "Our Development Process"}
              </span>
            </h2>
          </Fade>
        </div>

        <div className="dev-timeline tw-mt-16">
          <div className="dev-timeline-spine-track" />
          <motion.div
            className="dev-timeline-spine-fill"
            style={{ scaleY: spineScale }}
          />

          {steps.map((step, index) => (
            <ProcessNode
              key={step._id || step.title}
              number={index + 1}
              title={step.title}
              description={step.description}
              index={index}
              Icon={STEP_ICONS[index % STEP_ICONS.length]}
            />
          ))}
        </div>
      </div>

      <style>{`
        .dev-star {
          color: var(--tp-theme-primary);
          margin-right: 4px;
        }

        .dev-timeline {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        .dev-timeline-spine-track,
        .dev-timeline-spine-fill {
          position: absolute;
          left: 26px;
          top: 0;
          bottom: 0;
          width: 2px;
        }

        .dev-timeline-spine-track {
          background: rgba(255, 255, 255, 0.08);
        }

        .dev-timeline-spine-fill {
          background: linear-gradient(180deg, var(--tp-theme-primary), rgba(3, 220, 176, 0.2));
          box-shadow: 0 0 16px rgba(0, 255, 204, 0.5);
          transform-origin: top center;
        }

        .dev-timeline-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding-left: 64px;
          isolation: isolate;
        }

        .dev-timeline-node {
          position: absolute;
          left: 0;
          top: 0;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f11;
          border: 2px solid var(--tp-theme-primary);
          color: var(--tp-theme-primary);
          box-shadow: 0 0 0 6px rgba(3, 220, 176, 0.08), 0 0 20px rgba(0, 255, 204, 0.3);
          animation: devNodePulse 2.6s ease-in-out infinite;
          flex-shrink: 0;
          z-index: 2;
        }

        @keyframes devNodePulse {
          0%, 100% { box-shadow: 0 0 0 6px rgba(3, 220, 176, 0.08), 0 0 20px rgba(0, 255, 204, 0.3); }
          50% { box-shadow: 0 0 0 10px rgba(3, 220, 176, 0.14), 0 0 28px rgba(0, 255, 204, 0.5); }
        }

        .dev-timeline-card {
          position: relative;
          flex: 1;
          overflow: hidden;
          padding: 26px 28px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        .dev-timeline-card:hover {
          border-color: rgba(3, 220, 176, 0.5);
          box-shadow: 0 16px 40px rgba(0, 255, 204, 0.12);
          transform: translateY(-4px);
        }

        .dev-timeline-ghost-number {
          position: absolute;
          top: -18px;
          right: 4px;
          font-size: 84px;
          font-weight: 800;
          line-height: 1;
          color: rgba(255, 255, 255, 0.05);
          font-family: "Marcellus", serif;
          pointer-events: none;
        }

        .dev-timeline-card h3 {
          position: relative;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .dev-timeline-card p {
          position: relative;
          color: #cdcdcd;
          font-size: 14.5px;
          line-height: 1.7;
          margin: 0;
          max-width: 480px;
        }

        /* Desktop: true zig-zag with the spine down the middle */
        @media (min-width: 992px) {
          .dev-timeline-spine-track,
          .dev-timeline-spine-fill {
            left: 50%;
            margin-left: -1px;
          }

          .dev-timeline-item {
            padding-left: 0;
            width: 50%;
          }

          .dev-timeline-item-left {
            justify-content: flex-end;
            padding-right: 64px;
            margin-right: 50%;
          }

          .dev-timeline-item-right {
            flex-direction: row-reverse;
            padding-left: 64px;
            margin-left: 50%;
          }

          .dev-timeline-item-left .dev-timeline-node {
            left: auto;
            right: -27px;
          }

          .dev-timeline-item-right .dev-timeline-node {
            left: auto;
            right: -27px;
          }

          .dev-timeline-item-right .dev-timeline-ghost-number {
            right: auto;
            left: 4px;
          }
        }
      `}</style>
    </section>
  );
}
