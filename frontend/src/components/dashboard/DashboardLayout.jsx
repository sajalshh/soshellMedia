import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import "../../styles/dashboard.css";

const TAB_TITLES = {
  hero: "Hero Section",
  showcase: "Showcase Videos",
  aboutTabs: "We Understand Tabs",
  workProcess: "Work Process Steps",
  serviceCards: "Service Cards",
  projects: "Projects",
  pricing: "Pricing Plans",
  servicesPage: "Services Page",
  aboutPage: "About Page",
  team: "Team Members",
  blog: "Blog Posts",
  caseStudies: "Case Studies",
  portfolio: "Portfolio",
  seo: "Page SEO",
  aiCalls: "AI Call Logs",
  users: "User Management",
  roles: "Role Management",
  attendance: "Attendance Overview", // NEW
  tasks: "Task Management", // NEW
  myDashboard: "My Dashboard", // NEW
};

const DashboardLayout = ({ activeTab, onTabChange, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`dashboard-main-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
      >
        <DashboardHeader
          title={TAB_TITLES[activeTab] || "Dashboard"}
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
        />

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
