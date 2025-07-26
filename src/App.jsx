import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
// import Preloader from "./components/Preloader"; // 1. Import the Preloader
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* <Preloader isLoading={isLoading} /> */}
      {!isLoading && (
        <Routes>
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
            />{" "}
            <Route path="faq" element={<FaqPage />} />
            {/* 2. Add the dynamic route */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news-details/:postId" element={<NewsDetailsPage />} />
            {/* 2. Add the route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
