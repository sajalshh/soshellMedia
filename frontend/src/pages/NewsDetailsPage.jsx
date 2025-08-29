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

  // This new useEffect builds our TOC
  useEffect(() => {
    if (!post?.content) return;

    // We create a temporary element to parse the HTML string
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = post.content;

    // Find all h2 and h3 headings
    const foundHeadings = tempDiv.querySelectorAll("h2, h3");
    const extractedHeadings = [];

    foundHeadings.forEach((heading, index) => {
      const text = heading.innerText;
      const tagName = heading.tagName.toLowerCase(); // 'h2' or 'h3'

      // Create a unique ID from the heading text
      const id =
        text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") +
        "-" +
        index;

      // Add the ID to the heading element itself
      heading.setAttribute("id", id);

      // Save the data for our TOC list
      extractedHeadings.push({ id, text, tagName });
    });

    setHeadings(extractedHeadings);
    // Save the modified HTML (which now includes the IDs)
    setProcessedContent(tempDiv.innerHTML);
  }, [post]); // This effect runs whenever the post data is loaded

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
          <div className="col-12 col-lg-8">
            <div className="news-details-wrapper">
              <div className="news-details-items">
                <div className="news-details-thumb">
                  <img src={imageUrl} alt={altText} />
                </div>
                <div className="news-details-content">
                  <h2 dangerouslySetInnerHTML={{ __html: post.title }} />

                  {/* Our new, custom Table of Contents */}
                  {headings.length > 0 && (
                    <div className="toc-container card mb-4">
                      <div className="card-body">
                        <h5 className="card-title">Table of Contents</h5>
                        <ul>
                          {headings.map((heading) => (
                            <li
                              key={heading.id}
                              className={`toc-${heading.tagName}`}
                            >
                              <a href={`#${heading.id}`}>{heading.text}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Render the content that now has IDs in it */}
                  <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
