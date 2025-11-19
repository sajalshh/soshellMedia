// src/components/dashboard/homepage/ManageAboutVideo.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../../hooks/usePrivateApi";

const ManageAboutVideo = () => {
  const [videoUrl, setVideoUrl] = useState("");
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
    setSaveState({ status: "loading", message: "Saving..." });
    try {
      await privateApi.put("/homepage/about-section", { videoUrl });
      setSaveState({
        status: "success",
        message: "Video URL updated successfully!",
      });
    } catch (error) {
      setSaveState({
        status: "error",
        message: "Error: Could not save video URL.",
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
        <div className="mb-3">
          <label className="form-label">Wistia Video URL</label>
          <input
            type="text"
            className="form-control"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://fast.wistia.net/embed/iframe/..."
          />
          <small className="form-text text-muted">
            Enter the full Wistia embed URL here.
          </small>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saveState.status === "loading"}
        >
          {saveState.status === "loading" ? "Saving..." : "Save Video URL"}
        </button>
      </div>
    </div>
  );
};

export default ManageAboutVideo;
