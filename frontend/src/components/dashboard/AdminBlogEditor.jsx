import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import usePrivateApi from "../../hooks/usePrivateApi";

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const privateApi = usePrivateApi();
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
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

  // Fetch data if we are in "edit" mode
  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const response = await privateApi.get(`/blog/id/${id}`);
          const post = response.data.data;
          setFormData({
            title: post.title || "",
            metaTitle: post.metaTitle || "",
            metaDescription: post.metaDescription || "",
            keywords: post.keywords || "",
            url: post.slug || "",
            alt_tag: post.altTag || "",
            canonicalTag: post.canonicalTag || "",
          });
          setContent(post.content || "");
        } catch (error) {
          setStatus({
            loading: false,
            message: "Could not load post data.",
            error: true,
          });
        }
      };
      fetchPost();
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
    data.append("metaTitle", formData.metaTitle);
    data.append("metaDescription", formData.metaDescription);
    data.append("canonicalTag", formData.canonicalTag);
    data.append("keywords", formData.keywords);
    data.append("url", formData.url);
    data.append("alt_tag", formData.alt_tag);
    data.append("content", editorContent);
    data.append("excerpt", formData.metaDescription);

    if (featuredImageFile) {
      data.append("featuredImage", featuredImageFile);
    }

    try {
      if (isEditing) {
        await privateApi.put(`/blog/${id}`, data);
      } else {
        await privateApi.post("/blog", data);
      }
      setStatus({
        loading: false,
        message: "Post saved successfully!",
        error: false,
      });
      setTimeout(() => navigate("/dashboard/blog"), 1500);
    } catch (error) {
      setStatus({
        loading: false,
        message: "Failed to save post. Check required fields.",
        error: true,
      });
      console.error("Save error:", error.response?.data || error);
    }
  };

  // ✅ NEW: This function handles image uploads from the editor
  const imageUploadHandler = (blobInfo, progress) =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      privateApi
        .post("/blog/upload-image", formData)
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
      <h3 className="mb-4">{isEditing ? "Edit Blog" : "Create New Blog"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-body">
            {/* ... All your form inputs for title, meta, etc. remain the same ... */}
            <div className="mb-3">
              <label className="form-label">Blog Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <hr />
            <h5 className="text-muted">SEO Details</h5>
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
              <label className="form-label">Meta Description</label>
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
              <label className="form-label">Blog Feature Image</label>
              <input
                type="file"
                name="featuredImage"
                onChange={handleFileChange}
                className="form-control"
                accept="image/*"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">alt_tag</label>
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
                apiKey="mx8v2xw2bvbrj4wzn796afgy4qicr5xojrh5zilsywpjggsa"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  // ✅ MODIFIED: Added 'image' to the toolbar
                  toolbar:
                    "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  // ✅ NEW: Added image upload handler
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
                ? "Update Blog"
                : "Create Blog"}
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

export default AdminBlogEditor;
// checking rules