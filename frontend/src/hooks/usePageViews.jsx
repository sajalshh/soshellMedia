// src/hooks/usePageViews.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sends GA4 page_view events on initial load and on every route change.
 * Requires gtag snippet in index.html with send_page_view: false
 */
export default function usePageViews() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // safe wrapper for gtag; if not defined, push to dataLayer
    const sendGtag = (...args) => {
      if (typeof window.gtag === "function") {
        window.gtag(...args);
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(args);
      }
    };

    const page_path = location.pathname + location.search;
    const page_location = window.location.origin + page_path;
    const page_title = document.title || "";

    // send page_view event for SPA navigation
    sendGtag("event", "page_view", {
      page_path,
      page_location,
      page_title,
    });
  }, [location]);
}
