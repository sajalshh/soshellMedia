import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";
import SeoHelmet from "../components/SeoHelmet";
import { Building, FolderOpen } from "lucide-react";

// --- Skeleton Placeholder for a beautiful loading state ---
const CaseStudySkeleton = () => (
  <div className="tw-animate-pulse">
    <div className="tw-aspect-[4/3] tw-bg-gray-800 tw-rounded-xl"></div>
    <div className="tw-mt-4">
      <div className="tw-h-4 tw-w-1/3 tw-bg-gray-700 tw-rounded"></div>
      <div className="tw-h-8 tw-w-full tw-bg-gray-700 tw-rounded tw-mt-3"></div>
      <div className="tw-h-4 tw-w-3/4 tw-bg-gray-700 tw-rounded tw-mt-2"></div>
    </div>
  </div>
);

// --- The Beautified Case Study Card Component ---
const CaseStudyItem = ({ study, index }) => {
  const imageUrl = study.featuredImage || "/assets/img/blog/post-1.jpg";

  return (
    <motion.div
      className="tw-group tw-h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="tw-bg-[#1D1D21] tw-rounded-xl tw-overflow-hidden tw-border tw-border-[var(--tp-theme-primary)]/20 group-hover:tw-border-[var(--tp-theme-primary)] tw-transition-colors tw-duration-300 tw-flex tw-flex-col tw-h-full">
        <Link to={`/casestudy-details/${study.slug}`} className="tw-block">
          <div className="tw-overflow-hidden">
            <img
              src={imageUrl}
              alt={study.title}
              className="tw-w-full tw-aspect-video tw-object-cover tw-transition-transform tw-duration-500 group-hover:tw-scale-110"
            />
          </div>
        </Link>

        <div className="tw-p-6 tw-flex tw-flex-col tw-flex-grow">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-x-4 tw-gap-y-2 tw-text-sm tw-text-gray-400 tw-mb-3">
            <span className="tw-flex tw-items-center tw-gap-2">
              <Building size={16} /> Client: {study.client || "Confidential"}
            </span>
            <span className="tw-flex tw-items-center tw-gap-2">
              <FolderOpen size={16} /> {study.industry || "General"}
            </span>
          </div>
          <h3
            className="tw-text-xl tw-font-bold tw-text-white group-hover:tw-text-[var(--tp-theme-primary)] tw-transition-colors"
            dangerouslySetInnerHTML={{ __html: study.title }}
          />
          <div
            className="tw-text-gray-400 tw-mt-3 tw-text-sm tw-flex-grow"
            dangerouslySetInnerHTML={{
              __html: study.excerpt.substring(0, 120) + "...",
            }}
          />

          <div className="tw-mt-6">
            <Link to={`/casestudy-details/${study.slug}`} className="theme-btn">
              View Case Study <i className="fa-solid fa-arrow-right-long"></i>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Case Studies Page Component ---
export default function CaseStudiesPage() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await api.get("/casestudies");
        setStudies(response.data.data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  return (
    <>
      <SeoHelmet
        title="Our Case Studies"
        description="Explore our successful projects and see how we've helped our clients achieve their goals."
        pageUrl="/casestudies"
      />
      <section
        className="breadcrumb-wrapper bg-cover"
        style={{
          backgroundImage: "url('/assets/casestudies/casestudy-banner.jpg')",
        }}
      >
        <div className="container">
          <div className="section-title text-center mx-auto">
            <h2>
              Our Case{" "}
              <span style={{ color: "var(--tp-theme-primary)" }}>Studies</span>
            </h2>
          </div>
        </div>
      </section>

      <section className="news-standard fix section-padding">
        <div className="container">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
            {loading
              ? // --- Loading State: Render 6 skeleton cards ---
                Array.from({ length: 6 }).map((_, index) => (
                  <CaseStudySkeleton key={index} />
                ))
              : // --- Loaded State: Render all case studies in the grid ---
                studies.map((study, index) => (
                  <CaseStudyItem study={study} index={index} key={study._id} />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
