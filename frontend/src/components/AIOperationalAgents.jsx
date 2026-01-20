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
      <div className="container">
        <div className="section-title text-center">
          <h2>
            AI OPERATIONAL AGENTS: <span className="text-neon">YOUR 24/7 TEAM</span>
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
              WE PRIME THE LEAD. <span className="text-neon">YOU CLOSE THE DEAL.</span>
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

      {/* Inline CSS so you don’t need to edit legacy.css */}
      <style>{`
        .ai-agents-section {
          position: relative;
          padding-top: 80px;
          padding-bottom: 80px;
          background: transparent;
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

        .ai-agents-cta-box {
          width: 100%;
          max-width: 1050px;
          padding: 35px 35px;
          border-radius: 22px;
          background: linear-gradient(135deg, #00ecc1 0%, #006e5d 55%, #004e43 100%);
          border: 1px solid rgba(3, 220, 177, 0.85);
          box-shadow:
            0 10px 40px rgba(0, 255, 26, 0.25),
            0 0 20px rgba(0, 143, 114, 0.55);
          text-align: center;
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

        @media (max-width: 991px) {
          .ai-agents-cta-heading {
            font-size: 24px;
          }
          .ai-agents-description p {
            font-size: 16px;
          }
        }

        @media (max-width: 575px) {
          .ai-agents-section {
            padding-top: 60px;
            padding-bottom: 60px;
          }
          .ai-agents-cta-box {
            padding: 26px 18px;
          }
          .ai-agents-cta-heading {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}
