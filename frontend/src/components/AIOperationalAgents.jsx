import React from "react";

export default function AIOperationalAgents() {
  const items = [
    {
      title: "SMART VOICE",
      desc: "Inbound/Outbound agents for inquiries and persistent follow-ups.",
    },
    {
      title: "INSTANT CONNECT",
      desc: "24/7 SMS & Web-chat responses so you are always first to reply.",
    },
    {
      title: "CALENDAR MASTERY",
      desc: "Auto-books qualified meetings directly into your calendar.",
    },
    {
      title: "INDUSTRY-AGNOSTIC",
      desc: "Tailored solutions for Real Estate, Healthcare, Immigration, Legal, and Dental.",
    },
  ];

  return (
    <section className="ai-agents-section section-padding-2">
      {/* Background teal glow patches */}
      <div className="ai-agents-bg">
        <span className="ai-glow ai-glow-1" />
        <span className="ai-glow ai-glow-2" />
        <span className="ai-glow ai-glow-3" />
      </div>

      <div className="container">
        <div className="section-title text-center">
          <h2>
            AI OPERATIONAL AGENTS:{" "}
            <span className="text-neon">YOUR 24/7 TEAM</span>
          </h2>
          <p style={{ maxWidth: "850px", margin: "0 auto" }}>
            Any Industry. Every Workflow. No Lead Left Behind.
          </p>
        </div>

        <div className="ai-agents-description">
          <p>
            We bridge the gap between <b>"getting attention"</b> and{" "}
            <b>"closing the deal."</b> Our custom AI Agents act as your digital
            nervous system, managing the messy middle of business operations so
            you stay connected and organized—regardless of your industry.
          </p>
        </div>

        <div className="row justify-content-center mt-4">
          {items.map((item, idx) => (
            <div className="col-xl-3 col-lg-6 col-md-6 mb-4" key={idx}>
              <div className="ai-agent-box">
                <h4 className="ai-agent-title">{item.title}</h4>
                <p className="ai-agent-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ai-agents-cta">
          <div className="ai-agents-cta-box">
            <h3 className="ai-agents-cta-heading">
              WE PRIME THE LEAD.{" "}
              <span className="text-neon">YOU CLOSE THE DEAL.</span>
            </h3>

            <p className="ai-agents-cta-sub">
              Scale your workflow with our dedicated AI Agent division:{" "}
              <b>Let Ai Handle</b>
            </p>

            <a href="/appointment" className="theme-btn">
              Get Started
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .ai-agents-section {
          position: relative;
          padding-top: 80px;
          padding-bottom: 80px;
          background: transparent;
          overflow: hidden;
        }

        /* Background glow layer */
        .ai-agents-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .ai-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.7; /* 70% opacity */
          animation: aiGlowFloat 9s ease-in-out infinite;
        }

        /* More centered placement */
        .ai-glow-1 {
          top: 10%;
          left: 8%;
          background: radial-gradient(
            circle,
            rgba(3, 220, 176, 1),
            transparent 62%
          );
        }

        .ai-glow-2 {
          bottom: 10%;
          right: 8%;
          background: radial-gradient(
            circle,
            rgba(0, 236, 193, 0.95),
            transparent 62%
          );
          animation-delay: 1.5s;
        }

        .ai-glow-3 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 360px;
          height: 360px;
          background: radial-gradient(
            circle,
            rgba(3, 220, 176, 0.9),
            transparent 62%
          );
          animation-delay: 3s;
        }

        @keyframes aiGlowFloat {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(35px, -25px) scale(1.08);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        /* Content above bg */
        .ai-agents-section .container {
          position: relative;
          z-index: 2;
        }

        .ai-agents-description {
          text-align: center;
          margin-top: 20px;
        }

        .ai-agents-description p {
          color: #cdcdcd;
          font-size: 18px;
          line-height: 1.7;
          max-width: 950px;
          margin: 0 auto;
        }

        .ai-agent-box {
          height: 100%;
          padding: 28px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(3, 220, 176, 0.35);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
          transition: all 0.25s ease;
        }

        .ai-agent-box:hover {
          transform: translateY(-8px);
          border-color: rgba(3, 220, 176, 0.9);
          box-shadow: 0 10px 40px rgba(0, 255, 204, 0.18);
        }

        .ai-agent-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.04em;
          margin-bottom: 10px;
        }

        .ai-agent-desc {
          font-size: 15px;
          color: #cdcdcd;
          line-height: 1.6;
          margin: 0;
        }

        .ai-agents-cta {
          margin-top: 50px;
          display: flex;
          justify-content: center;
        }

        /* CTA BOX -> GRAY ONLY */
        .ai-agents-cta-box {
          width: 100%;
          max-width: 1050px;
          padding: 35px 35px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.10);
          box-shadow: 0 10px 45px rgba(0, 0, 0, 0.35);
          text-align: center;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .ai-agents-cta-heading {
          color: #ffffff;
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .ai-agents-cta-sub {
          color: rgba(255, 255, 255, 0.85);
          font-size: 16px;
          margin-bottom: 22px;
        }

        /* Tablet */
        @media (max-width: 991px) {
          .ai-agents-description p {
            font-size: 16px;
          }

          .ai-agents-cta-heading {
            font-size: 24px;
          }

          .ai-agents-section .section-title h2 {
            font-size: 38px !important;
            line-height: 1.15 !important;
          }

          .ai-agents-section .section-title p {
            font-size: 16px !important;
            line-height: 1.6 !important;
          }
        }

        /* Mobile */
        @media (max-width: 575px) {
          .ai-agents-section {
            padding-top: 60px;
            padding-bottom: 60px;
          }

          .ai-agents-section .section-title h2 {
            font-size: 28px !important;
            line-height: 1.2 !important;
            margin-bottom: 12px !important;
          }

          .ai-agents-section .section-title p {
            font-size: 14px !important;
            line-height: 1.6 !important;
            padding: 0 10px;
          }

          .ai-agents-description p {
            font-size: 14px;
            line-height: 1.65;
            padding: 0 10px;
          }

          .ai-agent-box {
            padding: 20px;
            border-radius: 16px;
          }

          .ai-agent-title {
            font-size: 16px;
          }

          .ai-agent-desc {
            font-size: 14px;
          }

          .ai-agents-cta-box {
            padding: 24px 16px;
            border-radius: 18px;
          }

          .ai-agents-cta-heading {
            font-size: 18px;
            line-height: 1.25;
          }

          .ai-agents-cta-sub {
            font-size: 14px;
            margin-bottom: 18px;
          }

          /* Keep glow visible on mobile */
          .ai-glow {
            width: 320px;
            height: 320px;
            filter: blur(65px);
            opacity: 0.7;
          }

          .ai-glow-1 {
            top: 6%;
            left: 5%;
          }

          .ai-glow-2 {
            bottom: 6%;
            right: 5%;
          }

          .ai-glow-3 {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </section>
  );
}
