import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import usePageViews from "./hooks/usePageViews";

/* ================= PUBLIC PAGES ================= */
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import ServicePage from "./pages/ServicePage";
import TeamPage from "./pages/TeamPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import BlogPage from "./pages/BlogPage";
import NewsDetailsPage from "./pages/NewsDetailsPage";
import FaqPage from "./pages/FaqPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import AppointmentPage from "./pages/AppointmentPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyDetailsPage from "./pages/CaseStudyDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

/* ================= DASHBOARD ================= */
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageBlog from "./components/dashboard/ManageBlog";
import ManageSeo from "./components/dashboard/ManageSeo";
import ManageCaseStudies from "./components/dashboard/ManageCaseStudies";
import AdminBlogEditor from "./components/dashboard/AdminBlogEditor";
import AdminCaseStudyEditor from "./components/dashboard/AdminCaseStudyEditor";

export default function App() {
  // The 2-second setTimeout block was removed from here.
  usePageViews();

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="service" element={<ServicePage />} />
        <Route path="service-details/:slug" element={<ServiceDetailsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="project" element={<ProjectPage />} />
        <Route
          path="project-details/:projectId"
          element={<ProjectDetailsPage />}
        />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog-details/:slug" element={<NewsDetailsPage />} />
        <Route path="casestudies" element={<CaseStudiesPage />} />
        <Route
          path="casestudy-details/:slug"
          element={<CaseStudyDetailsPage />}
        />
        <Route path="faq" element={<FaqPage />} />
        <Route path="appointment" element={<AppointmentPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ================= PROTECTED DASHBOARD ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/blog" element={<ManageBlog />} />
        <Route path="/dashboard/seo" element={<ManageSeo />} />
        <Route path="/dashboard/casestudies" element={<ManageCaseStudies />} />
        <Route path="/adminblog" element={<AdminBlogEditor />} />
        <Route path="/adminblog/edit/:id" element={<AdminBlogEditor />} />
        <Route path="/admincasestudy" element={<AdminCaseStudyEditor />} />
        <Route
          path="/admincasestudy/edit/:id"
          element={<AdminCaseStudyEditor />}
        />
      </Route>
    </Routes>
  );
}
