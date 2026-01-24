import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ✅ ALL components are now correctly imported
import ManageTeam from "../components/dashboard/ManageTeam";
import ManageHero from "../components/dashboard/homepage/ManageHero";
import ManageShowcase from "../components/dashboard/ManageShowcase";
import ManageAboutTabs from "../components/dashboard/homepage/ManageAboutTabs";
import ManageServiceCards from "../components/dashboard/homepage/ManageServiceCards";
import ManageProjects from "../components/dashboard/homepage/ManageProjects";
import ManageBlog from "../components/dashboard/ManageBlog";
import ManageSeo from "../components/dashboard/ManageSeo";
import ManageAboutVideo from "../components/dashboard/homepage/ManageAboutVideo";
import ManagePortfolio from "../components/dashboard/ManagePortfolio";
import ManagePortfolioCategories from "../components/dashboard/ManagePortfolioCategories";
import ManageServices from "../components/dashboard/ManageServices";
import ManageCaseStudies from "../components/dashboard/ManageCaseStudies";
import ManageWorkProcess from "../components/dashboard/ManageWorkProcess";
import ManagePricing from "../components/dashboard/ManagePricing";

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // State to manage which component is currently visible
  const [activeTab, setActiveTab] = useState("hero");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper function to render the active component
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "hero":
        return <ManageHero />;

      case "showcase":
        return <ManageShowcase />;

      case "aboutTabs":
        return (
          <>
            <ManageAboutVideo />
            <ManageAboutTabs />
          </>
        );

      case "workProcess":
        return <ManageWorkProcess />;

      case "serviceCards":
        return <ManageServiceCards />;

      case "projects":
        return <ManageProjects />;

      case "pricing":
        return <ManagePricing />;

      case "servicesPage":
        return <ManageServices />;

      case "team":
        return <ManageTeam />;

      case "blog":
        return <ManageBlog />;

      case "caseStudies":
        return <ManageCaseStudies />;

      case "portfolio":
        return (
          <>
            <ManagePortfolioCategories />
            <ManagePortfolio />
          </>
        );

      case "seo":
        return <ManageSeo />;

      default:
        return <ManageHero />;
    }
  };

  return (
    <div className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-4 px-3">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        {/* ======================================= */}
        {/* ======== Navigation Column ======== */}
        {/* ======================================= */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                  <h6 className="nav-link disabled text-muted">Homepage</h6>
                </li>

                <li className="nav-item">
                  <a
                    href="#hero"
                    className={`nav-link ${
                      activeTab === "hero" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("hero")}
                  >
                    Hero Section
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#showcase"
                    className={`nav-link ${
                      activeTab === "showcase" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("showcase")}
                  >
                    Showcase Videos
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#aboutTabs"
                    className={`nav-link ${
                      activeTab === "aboutTabs" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("aboutTabs")}
                  >
                    'We Understand' Tabs
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#workProcess"
                    className={`nav-link ${
                      activeTab === "workProcess" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("workProcess")}
                  >
                    Work Process Steps
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#serviceCards"
                    className={`nav-link ${
                      activeTab === "serviceCards" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("serviceCards")}
                  >
                    Service Cards
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#projects"
                    className={`nav-link ${
                      activeTab === "projects" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("projects")}
                  >
                    Projects
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#pricing"
                    className={`nav-link ${
                      activeTab === "pricing" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("pricing")}
                  >
                    Pricing Page
                  </a>
                </li>

                <hr />

                <li className="nav-item">
                  <h6 className="nav-link disabled text-muted">
                    Content Pages
                  </h6>
                </li>

                <li className="nav-item">
                  <a
                    href="#servicesPage"
                    className={`nav-link ${
                      activeTab === "servicesPage" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("servicesPage")}
                  >
                    Services Page
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#team"
                    className={`nav-link ${
                      activeTab === "team" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("team")}
                  >
                    Team Members
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#blog"
                    className={`nav-link ${
                      activeTab === "blog" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("blog")}
                  >
                    Blog Posts
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#caseStudies"
                    className={`nav-link ${
                      activeTab === "caseStudies" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("caseStudies")}
                  >
                    Case Studies
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    href="#portfolio"
                    className={`nav-link ${
                      activeTab === "portfolio" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("portfolio")}
                  >
                    Portfolio Page
                  </a>
                </li>

                <hr />

                <li className="nav-item">
                  <h6 className="nav-link disabled text-muted">
                    Global Settings
                  </h6>
                </li>

                <li className="nav-item">
                  <a
                    href="#seo"
                    className={`nav-link ${
                      activeTab === "seo" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("seo")}
                  >
                    Page SEO
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* ======== Content Column ========= */}
        {/* ======================================= */}
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">{renderActiveComponent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
