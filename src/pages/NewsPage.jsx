import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import the new Sidebar

// The BlogPostItem now correctly uses the "excerpt" from WordPress
const BlogPostItem = ({ post }) => {
  const imageUrl =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "/assets/img/news/post-1.jpg";
  const category =
    post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Uncategorized";

  return (
    <div className="news-standard-items">
      <div className="news-thumb">
        <img src={imageUrl} alt={post.title.rendered} />
      </div>
      <div className="news-content">
        <ul>
          <li>
            <i className="fa-regular fa-user"></i>
            {new Date(post.date).toLocaleDateString()}
          </li>
          <li>
            <i className="fa-regular fa-folder-open"></i>
            {category}
          </li>
        </ul>
        <h3>
          <Link
            to={`/news-details/${post.id}`}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </h3>
        {/* THIS IS THE FIX: Use post.excerpt.rendered to show the summary */}
        <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        <Link to={`/news-details/${post.id}`} className="theme-btn mt-4">
          Read More <i className="fa-solid fa-arrow-right-long"></i>
        </Link>
      </div>
    </div>
  );
};

export default function NewsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wordpressApiUrl =
      "http://soshellmedia-backend.local/wp-json/wp/v2/posts?_embed";

    axios
      .get(wordpressApiUrl)
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="section-padding">Loading posts...</div>;
  }

  return (
    <>
      {/* Your News Hero Section here... */}
      <section
        className="news-hero-section bg-cover"
        style={{ backgroundImage: "url('/assets/img/news/bg.jpg')" }}
      >
        {/* ... Hero Slider JSX ... */}
      </section>

      <section className="news-standard fix section-padding">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="news-standard-wrapper">
                {posts.map((post, index) => (
                  <Fade
                    direction="up"
                    delay={index * 100}
                    triggerOnce
                    key={post.id}
                  >
                    <BlogPostItem post={post} />
                  </Fade>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <Sidebar /> {/* Add the populated sidebar here */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
