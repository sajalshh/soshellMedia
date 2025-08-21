import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import api from "../api/axiosConfig"; // 👈 1. Use our API instance
import Sidebar from "../components/Sidebar";
import SeoHelmet from "../components/SeoHelmet";

// 2. Update BlogPostItem to use our new data structure
const BlogPostItem = ({ post }) => {
  const imageUrl = post.featuredImage || "/assets/img/blog/post-1.jpg";
  const category = post.category || "Uncategorized";

  return (
    <div className="news-standard-items">
      <div className="news-thumb">
        <img src={imageUrl} alt={post.title} />
      </div>
      <div className="news-content">
        <ul>
          <li>
            <i className="fa-regular fa-user"></i>
            {new Date(post.createdAt).toLocaleDateString()}
          </li>
          <li>
            <i className="fa-regular fa-folder-open"></i>
            {category}
          </li>
        </ul>
        <h3>
          {/* Link to the post using its 'slug' */}
          <Link
            to={`/blog-details/${post.slug}`}
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
        </h3>
        {/* Use the 'excerpt' field from our database */}
        <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <Link to={`/blog-details/${post.slug}`} className="theme-btn mt-4">
          Read More <i className="fa-solid fa-arrow-right-long"></i>
        </Link>
      </div>
    </div>
  );
};

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Change the API endpoint to our new backend
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

  if (loading) {
    return <div className="section-padding">Loading posts...</div>;
  }

  return (
    <>
      <SeoHelmet pageUrl="/blog" />
      <section
        className="news-hero-section bg-cover"
        style={{ backgroundImage: "url('/assets/img/blog/bg.jpg')" }}
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
                    key={post._id} // Use the database ID as the key
                  >
                    <BlogPostItem post={post} />
                  </Fade>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
