// src/components/dashboard/AdminCaseStudyEditor.jsx

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import usePrivateApi from "../../hooks/usePrivateApi";

const AdminCaseStudyEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const privateApi = usePrivateApi();
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    industry: "",
    metaTitle: "",
    metaDescription: "",
    canonicalTag: "",
    keywords: "",
    url: "",
    alt_tag: "",
  });
  const [content, setContent] = useState("");
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  // ... (rest of your useEffect and handler functions remain the same) ...
  useEffect(() => {
    if (isEditing) {
      const fetchCaseStudy = async () => {
        try {
          const response = await privateApi.get(`/casestudies/id/${id}`);
          const study = response.data.data;
          setFormData({
            title: study.title || "",
            client: study.client || "",
            industry: study.industry || "",
            metaTitle: study.metaTitle || "",
            metaDescription: study.metaDescription || "",
            keywords: study.keywords || "",
            url: study.slug || "",
            alt_tag: study.altTag || "",
            canonicalTag: study.canonicalTag || "",
          });
          setContent(study.content || "");
        } catch (error) {
          setStatus({
            loading: false,
            message: "Could not load case study data.",
            error: true,
          });
        }
      };
      fetchCaseStudy();
    }
  }, [id, isEditing, privateApi]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFeaturedImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "Saving...", error: false });

    const editorContent = editorRef.current
      ? editorRef.current.getContent()
      : content;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("client", formData.client);
    data.append("industry", formData.industry);
    data.append("metaTitle", formData.metaTitle);
    data.append("metaDescription", formData.metaDescription);
    data.append("canonicalTag", formData.canonicalTag);
    data.append("keywords", formData.keywords);
    data.append("url", formData.url);
    data.append("alt_tag", formData.alt_tag);
    data.append("content", editorContent);
    data.append("excerpt", formData.metaDescription); // Using meta desc as excerpt

    if (featuredImageFile) {
      data.append("featuredImage", featuredImageFile);
    }

    try {
      if (isEditing) {
        await privateApi.put(`/casestudies/${id}`, data);
      } else {
        await privateApi.post("/casestudies", data);
      }
      setStatus({
        loading: false,
        message: "Case study saved successfully!",
        error: false,
      });
      setTimeout(() => navigate("/dashboard/casestudies"), 1500);
    } catch (error) {
      setStatus({
        loading: false,
        message: "Failed to save. Check required fields.",
        error: true,
      });
      console.error("Save error:", error.response?.data || error);
    }
  };

  const imageUploadHandler = (blobInfo, progress) =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      privateApi
        .post("/casestudies/upload-image", formData)
        .then((response) => {
          if (response.data.location) {
            resolve(response.data.location);
          } else {
            reject("Image upload failed: Invalid response from server.");
          }
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || "HTTP error during image upload.";
          reject(errorMessage);
        });
    });

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">
        {isEditing ? "Edit Case Study" : "Create New Case Study"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            {/* ... (your form inputs for title, client, etc.) ... */}
            <div className="mb-3">
              <label className="form-label">Case Study Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            <hr />
            <h5 className="text-muted">SEO Details</h5>
            {/* --- All SEO inputs are the same as the blog editor --- */}
            <div className="mb-3">
              <label className="form-label">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Meta Description (Excerpt)</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                className="form-control"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Canonical Tag</label>
              <input
                type="text"
                name="canonicalTag"
                value={formData.canonicalTag}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Keywords (comma-separated)</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">URL (slug)</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <hr />
            <h5 className="text-muted">Featured Image</h5>
            <div className="mb-3">
              <label className="form-label">Case Study Feature Image</label>
              <input
                type="file"
                name="featuredImage"
                onChange={handleFileChange}
                className="form-control"
                accept="image/*"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image Alt Tag</label>
              <input
                type="text"
                name="alt_tag"
                value={formData.alt_tag}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <hr />
            <div className="mb-3">
              <label className="form-label">Content</label>
              <Editor
                // ✅ FIX: Replace the placeholder with your actual API key
                apiKey="mx8v2xw2bvbrj4wzn796afgy4qicr5xojrh5zilsywpjggsa"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content}
                init={{
                  height: 500,
                  menubar: false,
                  plugins:
                    "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                  toolbar:
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  images_upload_handler: imageUploadHandler,
                  file_picker_types: "image",
                  automatic_uploads: true,
                }}
              />
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status.loading}
            >
              {status.loading
                ? "Saving..."
                : isEditing
                ? "Update Case Study"
                : "Create Case Study"}
            </button>
            {status.message && (
              <span className={status.error ? "text-danger" : "text-success"}>
                {status.message}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminCaseStudyEditor;
