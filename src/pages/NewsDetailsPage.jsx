import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
import Sidebar from "../components/Sidebar";

export default function NewsDetailsPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // URL to fetch a single post by its ID. Again, replace with your local URL.
    const wordpressApiUrl = `http://soshellmedia-backend.local/wp-json/wp/v2/posts/${postId}?_embed`;

    axios
      .get(wordpressApiUrl)
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, [postId]); // Re-run this effect if the postId changes

  if (loading) {
    return <div className="section-padding">Loading post...</div>;
  }

  if (!post) {
    return <NotFoundPage />;
  }

  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/assets/img/news/post-1.jpg";

  return (
    <section className="news-details style-padding fix section-padding">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="news-details-wrapper">
              <div className="news-details-items">
                <div className="news-details-thumb">
                  <img src={imageUrl} alt={post.title.rendered} />
                </div>
                <div className="news-details-content">
                  <h2
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  {/* This renders the full post content from WordPress */}
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            {/* Your sidebar component will go here */}
            <Sidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
