import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Your existing page imports
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import NotFoundPage from "./pages/NotFoundPage";
import ContactPage from "./pages/ContactPage";
import ServicePage from "./pages/ServicePage";
import TeamPage from "./pages/TeamPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

import ProjectPage from "./pages/ProjectPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NewsPage from "./pages/NewsPage";
import FaqPage from "./pages/FaqPage";
import NewsDetailsPage from "./pages/NewsDetailsPage";
import ManageBlog from "./components/dashboard/ManageBlog";
import BlogPostEditor from "./components/dashboard/BlogPostEditor";
import ManageSeo from "./components/dashboard/ManageSeo";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import AppointmentPage from "./pages/AppointmentPage";


// 1. Import the new components for the dashboard
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isLoading && (
        <Routes>
          {/* ============================================= */}
          {/* === YOUR PUBLIC ROUTES (No changes here) === */}
          {/* ============================================= */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="service" element={<ServicePage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="project" element={<ProjectPage />} />
            <Route
              path="project-details/:projectId"
              element={<ProjectDetailsPage />}
            />
            <Route path="faq" element={<FaqPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="service-details/:slug"
              element={<ServiceDetailsPage />}
            />
            <Route path="news" element={<NewsPage />} />
            <Route path="news-details/:slug" element={<NewsDetailsPage />} />
            <Route path="appointment" element={<AppointmentPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ====================================================== */}
          {/* === 2. ADD THE PRIVATE DASHBOARD ROUTE SECTION HERE === */}
          {/* ====================================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="blog" element={<ManageBlog />} />
            <Route path="blog/new" element={<BlogPostEditor />} />{" "}
            <Route path="blog/edit/:id" element={<BlogPostEditor />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
