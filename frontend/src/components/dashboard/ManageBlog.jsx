// src/components/dashboard/ManageBlog.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageBlog = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(""); // A simpler state for handling errors
  const privateApi = usePrivateApi();
  const navigate = useNavigate();

  // This function fetches all the posts when the component loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await privateApi.get("/blog");
        setPosts(response.data.data);
      } catch (err) {
        setError("Failed to load blog posts.");
      }
    };
    fetchPosts();
  }, [privateApi]);

  // This function handles deleting a post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await privateApi.delete(`/blog/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete blog post.");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="card-title">Blog Posts</h4>
          {/* This button now navigates to your new editor page */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/adminblog")}
          >
            Add New Post
          </button>
        </div>

        {/* A simpler way to display any errors */}
        {error && <p className="alert alert-danger mt-3">{error}</p>}

        <div className="table-responsive mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.category}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    {/* This button now navigates to your new editor page to edit a specific post */}
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => navigate(`/adminblog/edit/${post._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* The entire modal and its form have been removed from the end of the file */}
    </div>
  );
};

export default ManageBlog;
