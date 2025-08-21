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

  if (loading) {
    return <div className="section-padding">Loading post...</div>;
  }

  if (!post) {
    return <NotFoundPage />;
  }

  const imageUrl = post.featuredImage || "/assets/img/blog/post-1.jpg";

  return (
    <section className="news-details style-padding fix section-padding">
      <SeoHelmet
        pageUrl={`/blog-details/${slug}`}
        title={post.title}
        description={post.excerpt || post.content}
      />
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="news-details-wrapper">
              <div className="news-details-items">
                <div className="news-details-thumb">
                  <img src={imageUrl} alt={post.title} />
                </div>
                <div className="news-details-content">
                  <h2 dangerouslySetInnerHTML={{ __html: post.title }} />
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
