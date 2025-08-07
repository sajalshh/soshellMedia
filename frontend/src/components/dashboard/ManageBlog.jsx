// src/components/dashboard/ManageBlog.jsx

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageBlog = () => {
  const [posts, setPosts] = useState([]);
  const privateApi = usePrivateApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [saveState, setSaveState] = useState({ status: "idle", message: "" });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await privateApi.get("/blog");
        setPosts(response.data.data);
      } catch (err) {
        setSaveState({
          status: "error",
          message: "Failed to load blog posts.",
        });
      }
    };
    fetchPosts();
  }, [privateApi]);

  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        if (saveState.status === "error") {
          setSaveState({ status: "idle", message: "" });
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveState.status]);

  useEffect(() => {
    if (isModalOpen && editor) {
      editor.commands.setContent(isEditing ? formData.content || "" : "");
    }
  }, [isModalOpen, isEditing, formData, editor]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await privateApi.delete(`/blog/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      setSaveState({ status: "error", message: "Failed to delete blog post." });
    }
  };

  const handleOpenModal = (post = null) => {
    setSelectedFile(null);
    setSaveState({ status: "idle", message: "" });
    if (post) {
      setIsEditing(true);
      setFormData(post);
    } else {
      setIsEditing(false);
      setFormData({
        title: "",
        excerpt: "",
        category: "Uncategorized",
        author: "Admin",
        content: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", editor.getHTML());
    data.append("excerpt", formData.excerpt);
    data.append("category", formData.category);
    data.append("author", formData.author);
    if (selectedFile) {
      data.append("featuredImage", selectedFile);
    }

    setSaveState({ status: "loading", message: "Saving..." });
    try {
      if (isEditing) {
        const response = await privateApi.put(`/blog/${formData._id}`, data);
        setPosts(
          posts.map((p) => (p._id === formData._id ? response.data.data : p)),
        );
      } else {
        const response = await privateApi.post("/blog", data);
        setPosts([...posts, response.data.data]);
      }
      setSaveState({ status: "success", message: "Post saved successfully!" });
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      setSaveState({ status: "error", message: "Failed to save blog post." });
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="card-title">Blog Posts</h4>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add New Post
          </button>
        </div>
        {saveState.status === "error" && (
          <p className="alert alert-danger mt-3">{saveState.message}</p>
        )}
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
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => handleOpenModal(post)}
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

      {isModalOpen && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                {/* --- MODAL HEADER RESTORED --- */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Edit Post" : "Add New Post"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                {/* --- MODAL BODY --- */}
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleFormChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Excerpt (Short Summary)
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt || ""}
                      onChange={handleFormChange}
                      className="form-control"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <div className="tiptap-editor-wrapper">
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Featured Image</label>
                    <input
                      type="file"
                      name="featuredImage"
                      onChange={handleFileChange}
                      className="form-control"
                      accept="image/*"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category || ""}
                        onChange={handleFormChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Author</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author || ""}
                        onChange={handleFormChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  {saveState.status !== "idle" && (
                    <span
                      className={`status-message ${saveState.status} me-auto`}
                    >
                      {saveState.message}
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={saveState.status === "loading"}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saveState.status === "loading"}
                  >
                    {saveState.status === "loading"
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBlog;
