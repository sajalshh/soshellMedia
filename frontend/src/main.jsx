import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Modal from "react-modal";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

// 1. External Frameworks & Plugins
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/swiper-bundle.min.css";
import "./assets/css/magnific-popup.css";
import "./assets/css/nice-select.css";

// 2. Local Vendor & Utility CSS
import "./assets/css/all.min.css";
import "./assets/css/animate.css";
import "./assets/css/meanmenu.css";
import "./assets/css/color.css";

// 3. Your Custom Styles & Overrides (Order matters: main before index)
import "./assets/css/main.css";
import "./index.css";

import App from "./App.jsx";

Modal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
