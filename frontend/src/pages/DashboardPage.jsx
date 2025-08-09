// src/pages/DashboardPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePrivateApi from "../hooks/usePrivateApi";
import ManageTeam from "../components/dashboard/ManageTeam";
import ManageHero from "../components/dashboard/homepage/ManageHero";
import ManageAboutTabs from "../components/dashboard/homepage/ManageAboutTabs";
import ManageServiceCards from "../components/dashboard/homepage/ManageServiceCards";
import ManageProjects from "../components/dashboard/homepage/ManageProjects";
import ManageBlog from "../components/dashboard/ManageBlog";
import ManageSeo from "../components/dashboard/ManageSeo";
import ManageAboutVideo from "../components/dashboard/homepage/ManageAboutVideo";

// ====================================================================
// REFACTORED COMPONENT WITH LOADING/SUCCESS STATE HANDLING
// This is the template to apply to your other "Manage" components.
// ====================================================================
const ManageAboutPage = () => {
  const [paragraphs, setParagraphs] = useState([]);
  // 1. A more robust state to handle idle, loading, success, and error states
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  // Fetch initial content
  useEffect(() => {
    const getContent = async () => {
      try {
        const response = await privateApi.get("/content/about");
        setParagraphs(response.data.pageContent.paragraphs);
      } catch (error) {
        console.error("Failed to fetch content", error);
        setSaveState({
          status: "error",
          message: "Could not load page content.",
        });
      }
    };
    getContent();
  }, [privateApi]);

  // 2. A separate effect to clear messages after a few seconds
  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        setSaveState({ status: "idle", message: "" });
      }, 4000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [saveState.status]);

  const handleParagraphChange = (index, value) => {
    const updatedParagraphs = [...paragraphs];
    updatedParagraphs[index] = value;
    setParagraphs(updatedParagraphs);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaveState({ status: "loading", message: "Saving..." }); // 3. Set to loading state

    try {
      await privateApi.put("/content/about", { paragraphs });
      setSaveState({
        status: "success",
        message: "Changes saved successfully!",
      }); // 4. Set to success state
    } catch (error) {
      setSaveState({
        status: "error",
        message: "Error: Could not save changes.",
      }); // 5. Set to error state
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Main Page Paragraphs</h4>
        <form onSubmit={handleSaveChanges}>
          {paragraphs.map((p, index) => (
            <div className="mb-3" key={index}>
              <label className="form-label">Paragraph {index + 1}</label>
              <textarea
                className="form-control"
                rows="5"
                value={p}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
              />
            </div>
          ))}

          {/* 6. Dynamic button and status message display */}
          <div className="d-flex align-items-center mt-4">
            <button
              type="submit"
              className="btn btn-primary me-3"
              disabled={saveState.status === "loading"}
            >
              {saveState.status === "loading" ? "Saving..." : "Save Paragraphs"}
            </button>
            {/* Display message only when not idle */}
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

// ====================================================================
// MAIN DASHBOARD COMPONENT
// ====================================================================
const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="section-padding container">
      {/* Added 'dashboard-header' for styling */}
      <div className="d-flex justify-content-between align-items-center mb-5 dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Added 'dashboard-accordion' for styling */}
      <div className="accordion dashboard-accordion" id="dashboardAccordion">
        {/* Added 'dashboard-section-title' for styling */}
        <h4 className="dashboard-section-title">Homepage Content</h4>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingHero">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseHero"
            >
              Edit Hero Section
            </button>
          </h2>
          <div
            id="collapseHero"
            className="accordion-collapse collapse show"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              <ManageHero />
            </div>
          </div>
        </div>
        {/* ... Other Homepage accordion items ... */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingAboutTabs">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseAboutTabs"
            >
              Edit 'We Understand' Tabs
            </button>
          </h2>
          <div
            id="collapseAboutTabs"
            className="accordion-collapse collapse"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              <ManageAboutVideo />
              <ManageAboutTabs />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingServiceCards">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseServiceCards"
            >
              Edit Service Cards
            </button>
          </h2>
          <div
            id="collapseServiceCards"
            className="accordion-collapse collapse"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              <ManageServiceCards />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingProjects">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseProjects"
            >
              Manage Projects
            </button>
          </h2>
          <div
            id="collapseProjects"
            className="accordion-collapse collapse"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              <ManageProjects />
            </div>
          </div>
        </div>

        <h4 className="dashboard-section-title">'About Us' Page Content</h4>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingAboutPage">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseAboutPage"
            >
              Edit Main Paragraphs
            </button>
          </h2>
          <div
            id="collapseAboutPage"
            className="accordion-collapse collapse"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              {/* This component now has the new logic */}
              <ManageAboutPage />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTeam">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTeam"
            >
              Manage Team Members
            </button>
          </h2>
          <div
            id="collapseTeam"
            className="accordion-collapse collapse"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              <ManageTeam />
            </div>
          </div>
        </div>

        <h4 className="dashboard-section-title">Blog Content</h4>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingBlog">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseBlog"
            >
              Manage Blog Posts
            </button>
          </h2>
          <div
            id="collapseBlog"
            className="accordion-collapse collapse"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              <ManageBlog />
            </div>
          </div>
        </div>

        {/* Added a title for the SEO section for consistency */}
        <h4 className="dashboard-section-title">Global Settings</h4>
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingSeo">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSeo"
            >
              Manage Page SEO
            </button>
          </h2>
          <div
            id="collapseSeo"
            className="accordion-collapse collapse show"
            data-bs-parent="#dashboardAccordion"
          >
            <div className="accordion-body">
              <ManageSeo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
