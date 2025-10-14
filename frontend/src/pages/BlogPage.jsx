import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axiosConfig";
import SeoHelmet from "../components/SeoHelmet";
import { Calendar, Tag } from "lucide-react";

// --- Skeleton Placeholder ---
const PostCardSkeleton = () => (
  <div className="tw-animate-pulse">
    <div className="tw-aspect-video tw-bg-gray-800 tw-rounded-xl"></div>
    <div className="tw-mt-4">
      <div className="tw-h-4 tw-w-1/3 tw-bg-gray-700 tw-rounded"></div>
      <div className="tw-h-8 tw-w-full tw-bg-gray-700 tw-rounded tw-mt-3"></div>
      <div className="tw-h-4 tw-w-3/4 tw-bg-gray-700 tw-rounded tw-mt-2"></div>
    </div>
  </div>
);

// --- The Beautified Blog Card Component ---
const BlogPostItem = ({ post, index }) => (
  <motion.div
    className="tw-group tw-h-full"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <div className="tw-bg-[#1D1D21] tw-rounded-xl tw-overflow-hidden tw-border tw-border-[var(--tp-theme-primary)]/20 group-hover:tw-border-[var(--tp-theme-primary)] tw-transition-colors tw-duration-300 tw-flex tw-flex-col tw-h-full">
      <Link to={`/blog-details/${post.slug}`} className="tw-block">
        <div className="tw-overflow-hidden">
          <img
            src={post.featuredImage || "/assets/img/blog/post-1.jpg"}
            alt={post.title}
            className="tw-w-full tw-aspect-video tw-object-cover tw-transition-transform tw-duration-500 group-hover:tw-scale-110"
          />
        </div>
      </Link>

      <div className="tw-p-6 tw-flex tw-flex-col tw-flex-grow">
        <div className="tw-flex tw-items-center tw-gap-4 tw-text-sm tw-text-gray-400 tw-mb-3">
          <span className="tw-flex tw-items-center tw-gap-2">
            <Tag size={16} /> {post.category || "Uncategorized"}
          </span>
          <span className="tw-flex tw-items-center tw-gap-2">
            <Calendar size={16} />{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3
          className="tw-text-xl tw-font-bold tw-text-white group-hover:tw-text-[var(--tp-theme-primary)] tw-transition-colors"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div
          className="tw-text-gray-400 tw-mt-3 tw-text-sm tw-flex-grow"
          dangerouslySetInnerHTML={{
            __html: post.excerpt.substring(0, 120) + "...",
          }}
        />

        <div className="tw-mt-6">
          <Link to={`/blog-details/${post.slug}`} className="theme-btn">
            Read More <i className="fa-solid fa-arrow-right-long"></i>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Main Blog Page Component ---
export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/blog");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <SeoHelmet pageUrl="/blog" />
      {/* --- HEADER SECTION CORRECTED --- */}
      <section
        // CHANGE 1: 'tw-py-16' class added to significantly reduce the section's height
        className="news-hero-section bg-cover tw-py-24"
        style={{ backgroundImage: "url('/assets/blog/blogbg.jpg')" }}
      >
        <div className="container">
          <div className="page-heading">
            <div className="section-title text-center mx-auto">
              {/* CHANGE 2: 'tw-font-black' class added to make the font much bolder */}
              <h2 className="tw-font-black">
                <b>Our</b> Blogs
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="news-standard fix section-padding">
        <div className="container">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <PostCardSkeleton key={index} />
                ))
              : posts.map((post, index) => (
                  <BlogPostItem post={post} index={index} key={post._id} />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
