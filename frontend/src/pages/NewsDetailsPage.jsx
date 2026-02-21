// src/pages/NewsDetailsPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import NotFoundPage from "./NotFoundPage";
import Sidebar from "../components/Sidebar";
import SeoHelmet from "../components/SeoHelmet";

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for our custom TOC
  const [headings, setHeadings] = useState([]);
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blog/${slug}`);
        setPost(response.data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Extract TOC and remove duplicate title
  useEffect(() => {
    if (!post?.content) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = post.content;

    // Remove first H1/H2 if it matches post.title
    const firstHeading = tempDiv.querySelector("h1, h2");
    if (firstHeading && firstHeading.innerText.trim() === post.title.trim()) {
      firstHeading.remove();
    }

    // Collect only h2 and h3 for TOC
    const foundHeadings = tempDiv.querySelectorAll("h2, h3");
    const extractedHeadings = [];

    foundHeadings.forEach((heading, index) => {
      const text = heading.innerText;
      const tagName = heading.tagName.toLowerCase();

      const id =
        text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") +
        "-" +
        index;

      heading.setAttribute("id", id);

      extractedHeadings.push({ id, text, tagName });
    });

    setHeadings(extractedHeadings);
    setProcessedContent(tempDiv.innerHTML);
  }, [post]);

  if (loading) {
    return <div className="section-padding">Loading post...</div>;
  }

  if (!post) {
    return <NotFoundPage />;
  }

  const imageUrl = post.featuredImage || "/assets/img/blog/post-1.jpg";
  const altText = post.altTag || post.title;

  return (
    <section className="news-details style-padding fix section-padding">
      <SeoHelmet
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        canonical={post.canonicalTag}
        keywords={post.keywords}
      />

      <div className="container">
        <div className="row g-4">
          {/* Main Blog Content */}
          <div className="col-12 col-lg-8">
            <div className="news-details-wrapper">
              <div className="news-details-items">
                <div className="news-details-thumb">
                  <img
                    src={imageUrl}
                    alt={altText}
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="news-details-content">
                  {/* Blog Title in H1 */}
                  <h1 dangerouslySetInnerHTML={{ __html: post.title }} />

                  {/* Blog Content */}
                  <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (with TOC) */}
          <div className="col-12 col-lg-4">
            <Sidebar headings={headings} />
          </div>
        </div>
      </div>
    </section>
  );
}
