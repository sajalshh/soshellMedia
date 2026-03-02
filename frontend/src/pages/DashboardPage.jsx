import React, { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

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
import ManageAiCalls from "../components/dashboard/ManageAiCalls";
import ManageAboutPage from "../components/dashboard/ManageAboutPage";
import ManageUsers from "../components/dashboard/ManageUsers";
import ManageRoles from "../components/dashboard/ManageRoles";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("hero");

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
      case "aboutPage":
        return <ManageAboutPage />;
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
      case "aiCalls":
        return <ManageAiCalls />;
      case "users":
        return <ManageUsers />;
      case "roles":
        return <ManageRoles />;
      default:
        return <ManageHero />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveComponent()}
    </DashboardLayout>
  );
};

export default DashboardPage;
