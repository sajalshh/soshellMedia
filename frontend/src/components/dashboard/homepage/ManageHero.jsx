// src/components/dashboard/homepage/ManageHero.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../../hooks/usePrivateApi";

const ManageHero = () => {
  const [heroContent, setHeroContent] = useState({
    headingLine1: "",
    headingLine2: "",
    headingLine3: "",
    subheading: "",
    buttonText: "",
    buttonLink: "",
  });
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

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

  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        setSaveState({ status: "idle", message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveState.status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHeroContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaveState({ status: "loading", message: "Saving..." });
    try {
      await privateApi.put("/homepage/hero", heroContent);
      setSaveState({
        status: "success",
        message: "Hero content updated successfully!",
      });
    } catch (error) {
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
          <div className="row">
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

          {/* --- CORRECTED JSX FOR BUTTON AND STATUS MESSAGE --- */}
          <div className="d-flex align-items-center mt-3">
            <button
              type="submit"
              className="btn btn-primary me-3"
              disabled={saveState.status === "loading"}
            >
              {saveState.status === "loading"
                ? "Saving..."
                : "Save Hero Content"}
            </button>
            {saveState.status !== "idle" && (
              <span className={`status-message ${saveState.status}`}>
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
