// src/components/dashboard/homepage/ManageAboutVideo.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../../hooks/usePrivateApi";

const ManageAboutVideo = () => {
  const [videoUrl, setVideoUrl] = useState(""); // Stores the current URL
  const [videoFile, setVideoFile] = useState(null); // Stores the new file to upload
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await privateApi.get("/homepage/about-section");
        if (response.data.data) {
          setVideoUrl(response.data.data.videoUrl);
        }
      } catch (error) {
        console.error("Failed to fetch video URL", error);
      }
    };
    fetchVideoUrl();
  }, [privateApi]);

  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(
        () => setSaveState({ status: "idle", message: "" }),
        4000,
      );
      return () => clearTimeout(timer);
    }
  }, [saveState.status]);

  const handleSave = async () => {
    setSaveState({ status: "loading", message: "Uploading & Saving..." });

    const formData = new FormData();

    // Append the file if selected
    if (videoFile) {
      // 'aboutVideo' MUST match the backend route name
      formData.append("aboutVideo", videoFile);
    } else {
      // If no new file, we might just want to save the text URL (optional fallback)
      formData.append("videoUrl", videoUrl);
    }

    try {
      // Send FormData
      const response = await privateApi.put(
        "/homepage/about-section",
        formData,
      );

      // Update local state with new URL from server
      if (response.data.data) {
        setVideoUrl(response.data.data.videoUrl);
      }

      setSaveState({
        status: "success",
        message: "Video updated successfully!",
      });
      setVideoFile(null); // Reset file input
    } catch (error) {
      console.error(error);
      setSaveState({
        status: "error",
        message: "Error: Could not save video.",
      });
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h3 className="card-title">Edit 'We Understand' Section Video</h3>

        {saveState.status !== "idle" && (
          <div className={`alert mt-3 status-message ${saveState.status}`}>
            {saveState.message}
          </div>
        )}

        <div className="mb-4 p-3 border rounded bg-light">
          <label className="form-label fw-bold">Upload Video (MP4)</label>

          {/* File Input */}
          <input
            type="file"
            className="form-control mb-2"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />

          {/* Current Video Display */}
          {videoUrl ? (
            <div className="mt-2">
              <small className="text-success fw-bold">
                ✓ Current Active Video:
              </small>
              <br />
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-break text-primary"
                style={{ fontSize: "0.85rem" }}
              >
                {videoUrl}
              </a>
            </div>
          ) : (
            <small className="text-muted">No video uploaded yet.</small>
          )}

          <div className="form-text text-muted mt-2">
            <i className="fas fa-info-circle me-1"></i>
            Max file size: 100MB. Please compress before uploading.
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saveState.status === "loading"}
        >
          {saveState.status === "loading" ? "Saving..." : "Save Video"}
        </button>
      </div>
    </div>
  );
};

export default ManageAboutVideo;
