import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { ArrowRight } from "lucide-react";
import SeoHelmet from "../components/SeoHelmet";
import api from "../api/axiosConfig";
import DevTechStack from "../components/dev/DevTechStack";
import DevProjectShowcase from "../components/dev/DevProjectShowcase";
import DevProcess from "../components/dev/DevProcess";
import breadcrumbBg from "../assets/img/breadcrumb-bg.jpg";
import starIcon from "../assets/img/star.png";

export default function DevelopmentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/development");
        setData(response.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch development page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ minHeight: "60vh" }} />;
  }

  const content = data?.content || {};
  const technologies = data?.technologies || [];
  const process = data?.process || [];
  const projects = data?.projects || [];

  return (
    <>
      <SeoHelmet pageUrl="/development" />

      {/* Breadcrumb / Hero */}
      <div
        className="breadcrumb-wrapper bg-cover"
        style={{ backgroundImage: `url(${breadcrumbBg})` }}
      >
        <div className="container">
          <div className="page-heading">
            <Fade direction="up" triggerOnce>
              <h6>
                <img src={starIcon} alt="img" />{" "}
                {content.badgeText || "web & app development"}
              </h6>
            </Fade>
            <Fade direction="up" delay={300} triggerOnce>
              <h1>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      (
                        content.heading ||
                        "We Build Websites & Apps That Actually Convert"
                      ).replace(
                        /(Convert|Convert\.)/,
                        '<span class="text-neon">$1</span>',
                      ),
                  }}
                />
              </h1>
            </Fade>
          </div>
          <div className="breadcrumb-description">
            <Fade direction="up" delay={500} triggerOnce>
              <p>
                {content.description ||
                  "From Shopify storefronts to custom Next.js platforms — we design, build, and ship fast, scalable products on the tools that fit your business best."}
              </p>
            </Fade>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <DevTechStack
        technologies={technologies}
        title={content.techSectionTitle}
        subtitle={content.techSectionSubtitle}
      />

      {/* Project Showcase */}
      <DevProjectShowcase
        projects={projects}
        title={content.showcaseSectionTitle}
        subtitle={content.showcaseSectionSubtitle}
      />

      {/* Process */}
      <DevProcess
        steps={process}
        title={content.processSectionTitle}
        subtitle={content.processSectionSubtitle}
      />

      {/* CTA */}
      <section className="dev-cta-section section-padding-2">
        <div className="container">
          <div className="dev-cta-box">
            <h3>
              {content.ctaHeading || "Got a Project in Mind?"}
            </h3>
            <p>
              {content.ctaSubheading ||
                "Let's build something fast, functional, and future-proof."}
            </p>
            <Link to="/appointment" className="theme-btn">
              Start Your Project <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <style>{`
          .dev-cta-box {
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
            padding: 60px 40px;
            border-radius: 24px;
            background: radial-gradient(120% 140% at 50% 0%, rgba(3,220,176,0.12), rgba(255,255,255,0.03));
            border: 1px solid rgba(3, 220, 176, 0.25);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
          }
          .dev-cta-box h3 {
            color: #ffffff;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
          }
          .dev-cta-box p {
            color: #cdcdcd;
            font-size: 16px;
            margin-bottom: 26px;
          }
          .dev-cta-box .theme-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          @media (max-width: 575px) {
            .dev-cta-box { padding: 40px 20px; border-radius: 18px; }
            .dev-cta-box h3 { font-size: 24px; }
          }
        `}</style>
      </section>
    </>
  );
}
