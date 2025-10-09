import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import usePageViews from "./hooks/usePageViews";

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
import BlogPage from "./pages/BlogPage";
import FaqPage from "./pages/FaqPage";
import NewsDetailsPage from "./pages/NewsDetailsPage";
import ManageBlog from "./components/dashboard/ManageBlog";
import BlogPostEditor from "./components/dashboard/BlogPostEditor";
import AdminBlogEditor from "./components/dashboard/AdminBlogEditor";
import ManageSeo from "./components/dashboard/ManageSeo";
import RegisterPage from "./pages/RegisterPage"; 
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import AppointmentPage from "./pages/AppointmentPage";
import ManageCaseStudies from "./components/dashboard/ManageCaseStudies";
import AdminCaseStudyEditor from "./components/dashboard/AdminCaseStudyEditor";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyDetailsPage from "./pages/CaseStudyDetailsPage";

// 1. Import the new components for the dashboard
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  usePageViews();

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
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog-details/:slug" element={<NewsDetailsPage />} />
            <Route path="casestudies" element={<CaseStudiesPage />} />
            <Route
              path="casestudy-details/:slug"
              element={<CaseStudyDetailsPage />}
            />
            <Route path="appointment" element={<AppointmentPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ====================================================== */}
          {/* === 2. ADD THE PRIVATE DASHBOARD ROUTE SECTION HERE === */}
          {/* ====================================================== */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/blog" element={<ManageBlog />} />
            <Route path="/dashboard/seo" element={<ManageSeo />} />
            <Route path="/adminblog" element={<AdminBlogEditor />} />
            <Route path="/adminblog/edit/:id" element={<AdminBlogEditor />} />
            <Route
              path="/dashboard/casestudies"
              element={<ManageCaseStudies />}
            />
            <Route path="/admincasestudy" element={<AdminCaseStudyEditor />} />
            <Route
              path="/admincasestudy/edit/:id"
              element={<AdminCaseStudyEditor />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
}
