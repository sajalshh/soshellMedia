import React, { useEffect, useRef, useState } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageShowcase = () => {
  const [items, setItems] = useState([]);

  const [currentItem, setCurrentItem] = useState({
    title: "",
    displayOrder: 0,
    isActive: true,
  });

  const [videoFile, setVideoFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  // ✅ NEW: show a nice UI error instead of browser "not focusable"
  const [fileError, setFileError] = useState("");

  const privateApi = usePrivateApi();
  const fileInputRef = useRef(null);

  const fetchItems = async () => {
    try {
      const response = await privateApi.get("/showcase");
      setItems(response.data.data);
    } catch (error) {
      console.error("Failed to fetch showcase items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCurrentItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setFileSafely = (file) => {
    if (!file) return;

    const allowedTypes = ["video/mp4", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only MP4 or WebM video files are allowed!");
      setVideoFile(null);
      return;
    }

    // Optional: client-side size check (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("Video too large. Max allowed is 100MB.");
      setVideoFile(null);
      return;
    }

    setFileError("");
    setVideoFile(file);
  };

  const handleFileChange = (e) => {
    setFileSafely(e.target.files?.[0]);
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isUploading) return;

    const file = e.dataTransfer.files?.[0];
    setFileSafely(file);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setCurrentItem({
      title: "",
      displayOrder: 0,
      isActive: true,
    });
    setVideoFile(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // ✅ Required validation done in JS (not HTML required attribute)
    if (!isEditing && !videoFile) {
      setFileError("Please upload a video first.");
      return;
    }

    const formData = new FormData();
    formData.append("title", currentItem.title);
    formData.append("displayOrder", currentItem.displayOrder);
    formData.append("isActive", currentItem.isActive);

    if (videoFile) {
      formData.append("videoFile", videoFile);
    }

    const method = isEditing ? "put" : "post";
    const url = isEditing ? `/showcase/${editId}` : "/showcase";

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await privateApi[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Failed to save showcase item:", error);
      alert("Failed to save. Check console for details.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setCurrentItem({
      title: item.title || "",
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive ?? true,
    });
    setVideoFile(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await privateApi.delete(`/showcase/${id}`);
        fetchItems();
      } catch (error) {
        console.error("Failed to delete showcase item:", error);
      }
    }
  };

  const openFilePicker = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const readableSize = (bytes) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="position-relative">
      {/* ✅ Uploading Overlay */}
      {isUploading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            background: "rgba(255,255,255,0.85)",
            zIndex: 10,
            borderRadius: "12px",
          }}
        >
          <div className="spinner-border text-primary mb-3" role="status" />
          <h6 className="mb-2">Uploading video...</h6>
          <div style={{ width: "70%" }}>
            <div className="progress" style={{ height: "18px" }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <h3 className="card-title">
            {isEditing ? "Edit Showcase Video" : "Add Showcase Video"}
          </h3>

          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label">Title (optional)</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={currentItem.title}
                onChange={handleInputChange}
                disabled={isUploading}
              />
            </div>

            {/* ✅ Drag & Drop Upload Box */}
            <div className="mb-3">
              <label className="form-label">Upload Video (MP4/WebM)</label>

              <div
                onClick={openFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="p-4 text-center"
                style={{
                  border: `2px dashed ${isDragging ? "#0d6efd" : "#ccc"}`,
                  borderRadius: "12px",
                  cursor: isUploading ? "not-allowed" : "pointer",
                  background: isDragging ? "rgba(13,110,253,0.08)" : "#fafafa",
                  transition: "0.2s ease",
                }}
              >
                <p className="mb-1 fw-bold">Drag & Drop your video here</p>
                <p className="mb-0 text-muted">
                  or click to select (MP4 / WebM, max 100MB)
                </p>

                {videoFile && (
                  <div className="mt-3">
                    <span className="badge bg-success">
                      Selected: {videoFile.name} ({readableSize(videoFile.size)}
                      )
                    </span>
                  </div>
                )}
              </div>

              {/* ❌ IMPORTANT FIX: NO "required" on hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                onChange={handleFileChange}
                accept="video/mp4, video/webm"
                disabled={isUploading}
              />

              {fileError && (
                <small className="text-danger d-block mt-2">{fileError}</small>
              )}

              {isEditing && (
                <small className="text-muted d-block mt-1">
                  Leave empty to keep current video
                </small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                name="displayOrder"
                value={currentItem.displayOrder}
                onChange={handleInputChange}
                disabled={isUploading}
              />
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isActive"
                name="isActive"
                checked={currentItem.isActive}
                onChange={handleInputChange}
                disabled={isUploading}
              />
              <label className="form-check-label" htmlFor="isActive">
                Active (show on homepage)
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading
                ? "Uploading..."
                : isEditing
                ? "Update Video"
                : "Add Video"}
            </button>

            {isEditing && !isUploading && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>

          <hr className="my-4" />

          <h4 className="mt-4">Existing Showcase Videos</h4>

          <ul className="list-group">
            {items.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.title || "Untitled"}</strong>
                  <br />
                  <small className="text-muted">
                    Order: {item.displayOrder} | Active:{" "}
                    {item.isActive ? "Yes" : "No"}
                  </small>
                </div>

                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(item)}
                    disabled={isUploading}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item._id)}
                    disabled={isUploading}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageShowcase;
