// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Modal from "react-modal";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async"; // 👈 Import the AuthProvider

import "./index.css";

import App from "./App.jsx";

Modal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          {" "}
          {/* 👈 Wrap your App component */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
