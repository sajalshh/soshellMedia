import React from "react";
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";
import { ArrowUpRight, Globe } from "lucide-react";
import LinkThumbnail, { normalizeUrl } from "./LinkThumbnail";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" },
  }),
};

const ProjectCard = ({ project, index }) => {
  const normalized = normalizeUrl(project.url);

  return (
    <motion.a
      href={normalized?.href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="dev-project-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover="hover"
    >
      {/* Fake browser chrome so the screenshot reads as a "live site" */}
      <div className="dev-browser-chrome">
        <span className="dev-dot dev-dot-red" />
        <span className="dev-dot dev-dot-yellow" />
        <span className="dev-dot dev-dot-green" />
        <span className="dev-browser-url">
          <Globe size={11} />
          {normalized?.hostname || "preview"}
        </span>
      </div>

      <div className="dev-project-thumb-wrap">
        <LinkThumbnail
          url={project.url}
          alt={project.title}
          imgSrc={project.thumbnailOverride || undefined}
          rounded="tw-rounded-none"
          fit="contain"
        />
        <motion.span
          className="dev-project-visit"
          variants={{
            hidden: { y: 10, opacity: 0 },
            visible: { y: 10, opacity: 0 },
            hover: { y: 0, opacity: 1 },
          }}
        >
          Visit Site <ArrowUpRight size={14} />
        </motion.span>
      </div>

      <div className="dev-project-info">
        <h4>{project.title}</h4>
        {project.description && <p>{project.description}</p>}
        {Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="dev-project-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="dev-project-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.a>
  );
};

export default function DevProjectShowcase({ projects = [], title, subtitle }) {
  if (projects.length === 0) return null;

  return (
    <section className="dev-showcase-section section-padding-2 fix section-bg">
      <div className="container">
        <div className="section-title text-center mx-auto">
          <Fade direction="up" triggerOnce>
            <h6>
              <span className="dev-star">✦</span> selected work
            </h6>
          </Fade>
          <Fade direction="up" delay={200} triggerOnce>
            <h2>
              {title || "Recent Work"}
              <br />
              <span className="text-neon">
                {subtitle || "Projects We're Proud Of"}
              </span>
            </h2>
          </Fade>
        </div>

        <div className="dev-project-grid tw-mt-12">
          {projects.map((project, i) => (
            <ProjectCard key={project._id || project.url} project={project} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .dev-project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
          justify-content: center;
          gap: 30px;
        }

        .dev-project-card {
          display: block;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-decoration: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        .dev-project-card:hover {
          border-color: rgba(3, 220, 176, 0.5);
          box-shadow: 0 20px 50px rgba(0, 255, 204, 0.14);
          transform: translateY(-6px);
        }

        .dev-browser-chrome {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: #18181c;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .dev-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dev-dot-red { background: #ff5f56; }
        .dev-dot-yellow { background: #ffbd2e; }
        .dev-dot-green { background: #27c93f; }

        .dev-browser-url {
          margin-left: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.45);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 999px;
          padding: 4px 12px;
          max-width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dev-project-thumb-wrap {
          position: relative;
          width: 100%;
          height: 230px;
          overflow: hidden;
          background: radial-gradient(120% 120% at 50% 0%, rgba(3,220,176,0.10), rgba(255,255,255,0.02) 70%);
        }

        .dev-project-visit {
          position: absolute;
          right: 14px;
          bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          background: var(--tp-theme-primary);
          color: #04140f;
          font-weight: 700;
          font-size: 13px;
          z-index: 2;
        }

        .dev-project-info {
          padding: 18px 22px 24px;
        }

        .dev-project-info h4 {
          color: #ffffff;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .dev-project-info p {
          color: #a9a9ad;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .dev-project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .dev-project-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          color: var(--tp-theme-primary);
          background: rgba(3, 220, 176, 0.1);
          border: 1px solid rgba(3, 220, 176, 0.25);
        }

        @media (max-width: 575px) {
          .dev-project-thumb-wrap {
            height: 190px;
          }
        }
      `}</style>
    </section>
  );
}
