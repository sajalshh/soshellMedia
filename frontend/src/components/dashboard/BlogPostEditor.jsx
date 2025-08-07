// src/components/dashboard/BlogPostEditor.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import usePrivateApi from "../../hooks/usePrivateApi";

const BlogPostEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const privateApi = usePrivateApi();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [author, setAuthor] = useState("Admin");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    if (isEditing && editor) {
      const fetchPost = async () => {
        try {
          const response = await privateApi.get(`/blog/id/${id}`);
          const post = response.data.data;
          setTitle(post.title);
          setExcerpt(post.excerpt);
          setCategory(post.category);
          setAuthor(post.author);
          editor.commands.setContent(post.content);
        } catch (error) {
          // Use saveState for fetch errors
          setSaveState({
            status: "error",
            message: "Error: Could not load post data.",
          });
        }
      };
      fetchPost();
    }
  }, [id, isEditing, editor, privateApi]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editor.getHTML());
    formData.append("excerpt", excerpt);
    formData.append("category", category);
    formData.append("author", author);
    if (featuredImage) {
      formData.append("featuredImage", featuredImage);
    }
    setSaveState({ status: "loading", message: "Saving..." });
    try {
      if (isEditing) {
        await privateApi.put(`/blog/${id}`, formData);
      } else {
        await privateApi.post("/blog", formData);
      }
      setSaveState({ status: "success", message: "Post saved successfully!" });
      setTimeout(() => {
        navigate("/dashboard/blog");
      }, 1500);
    } catch (error) {
      setSaveState({ status: "error", message: "Error: Could not save post." });
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">
          {isEditing ? "Edit Blog Post" : "Create New Post"}
        </h3>
        {saveState.status === "error" &&
          !saveState.message.includes("save") && (
            <div className="alert alert-danger">{saveState.message}</div>
          )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Excerpt (Short Summary)</label>
            <textarea
              className="form-control"
              rows="3"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
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
              className="form-control"
              onChange={(e) => setFeaturedImage(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Author</label>
              <input
                type="text"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex align-items-center mt-4">
            <button
              type="submit"
              className="btn btn-primary me-3"
              disabled={saveState.status === "loading"}
            >
              {saveState.status === "loading" ? "Saving..." : "Save Post"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard/blog")}
              disabled={saveState.status === "loading"}
            >
              Cancel
            </button>
            {saveState.status !== "idle" && (
              <span className={`status-message ${saveState.status} ms-3`}>
                {saveState.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostEditor;
