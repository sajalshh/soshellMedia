// src/components/dashboard/homepage/ManageHero.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../../hooks/usePrivateApi";

const ManageHero = () => {
  // State for text content
  const [heroContent, setHeroContent] = useState({
    headingLine1: "",
    headingLine2: "",
    headingLine3: "",
    subheading: "",
    buttonText: "",
    buttonLink: "",
    videoUrl: "", // Added videoUrl here to display current link
  });

  // State for the new video file upload
  const [videoFile, setVideoFile] = useState(null);

  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  // 1. Fetch current data on load
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await privateApi.get("/homepage/hero");
        if (response.data.data) {
          setHeroContent(response.data.data);
        }
      } catch (error) {
        setSaveState({
          status: "error",
          message: "Error: Could not load hero content.",
        });
      }
    };
    fetchHeroContent();
  }, [privateApi]);

  // 2. Clear messages after 4 seconds
  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        setSaveState({ status: "idle", message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveState.status]);

  // 3. Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroContent((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Handle Form Submit (With File Support)
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaveState({ status: "loading", message: "Saving..." });

    // Create a FormData object to hold text + file
    const formData = new FormData();

    // Append text fields
    formData.append("headingLine1", heroContent.headingLine1);
    formData.append("headingLine2", heroContent.headingLine2);
    formData.append("headingLine3", heroContent.headingLine3);
    formData.append("subheading", heroContent.subheading);
    formData.append("buttonText", heroContent.buttonText);
    formData.append("buttonLink", heroContent.buttonLink);

    // Append Video File (only if user selected a new one)
    // Note: 'heroVideo' must match the name in your backend route: uploadVideo.single('heroVideo')
    if (videoFile) {
      formData.append("heroVideo", videoFile);
    }

    try {
      // Send as FormData (Axios handles headers automatically)
      const response = await privateApi.put("/homepage/hero", formData);

      // Update local state with the new data returned from server
      if (response.data.data) {
        setHeroContent(response.data.data);
      }

      setSaveState({
        status: "success",
        message: "Hero content updated successfully!",
      });

      // Clear the file input state
      setVideoFile(null);
    } catch (error) {
      console.error("Upload Error:", error);
      setSaveState({
        status: "error",
        message: "Error: Could not save changes.",
      });
    }
  };

  return (
    <div className="card mb-5">
      <div className="card-body">
        <h3 className="card-title">Edit Hero Section</h3>
        <p className="card-text text-muted">
          <small>
            Tip: To make text neon, wrap it in asterisks. Example: `This is
            *neon* text.`
          </small>
        </p>
        <form onSubmit={handleSaveChanges}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Heading Line 1</label>
              <input
                type="text"
                name="headingLine1"
                value={heroContent.headingLine1 || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Heading Line 2</label>
              <input
                type="text"
                name="headingLine2"
                value={heroContent.headingLine2 || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Heading Line 3</label>
              <input
                type="text"
                name="headingLine3"
                value={heroContent.headingLine3 || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Subheading</label>
            <textarea
              name="subheading"
              value={heroContent.subheading || ""}
              onChange={handleChange}
              className="form-control"
              rows="3"
            ></textarea>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Button Text</label>
              <input
                type="text"
                name="buttonText"
                value={heroContent.buttonText || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Button Link</label>
              <input
                type="text"
                name="buttonLink"
                value={heroContent.buttonLink || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* --- NEW VIDEO UPLOAD SECTION --- */}
          <div className="mb-4 p-3 border rounded bg-light">
            <label className="form-label fw-bold">Background Video (MP4)</label>

            {/* File Input */}
            <input
              type="file"
              className="form-control mb-2"
              accept="video/mp4"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />

            {/* Current Video Display */}
            {heroContent.videoUrl ? (
              <div className="mt-2">
                <small className="text-success fw-bold">
                  ✓ Current Video Active:
                </small>
                <br />
                <a
                  href={heroContent.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-break"
                  style={{ fontSize: "0.85rem" }}
                >
                  {heroContent.videoUrl}
                </a>
              </div>
            ) : (
              <small className="text-muted">
                No custom video uploaded yet.
              </small>
            )}

            <div className="form-text text-muted mt-2">
              <i className="fas fa-info-circle me-1"></i>
              Recommended: Compress video using Handbrake (Web Optimized). Keep
              under 10MB for speed. Max upload: 100MB.
            </div>
          </div>

          {/* --- SUBMIT BUTTON --- */}
          <div className="d-flex align-items-center mt-3">
            <button
              type="submit"
              className="btn btn-primary me-3"
              disabled={saveState.status === "loading"}
            >
              {saveState.status === "loading"
                ? "Uploading & Saving..."
                : "Save Hero Content"}
            </button>

            {saveState.status !== "idle" && (
              <span className={`status-message ${saveState.status} fw-bold`}>
                {saveState.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageHero;
