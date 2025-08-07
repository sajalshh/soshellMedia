// src/components/SeoHelmet.jsx

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axiosConfig";

// A helper to create a simple text excerpt from HTML
const createExcerpt = (htmlString, length = 155) => {
  if (!htmlString) return "";
  const text = htmlString.replace(/<[^>]+>/g, ""); // Strip HTML tags
  if (text.length <= length) return text;
  return text.substr(0, text.lastIndexOf(" ", length)) + "...";
};

const SeoHelmet = ({ pageUrl, title, description }) => {
  const [seo, setSeo] = useState({
    title: "Soshell Media", // Default title
    metaDescription: "Performance-driven content studio.",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    const fetchSeoData = async () => {
      console.log("1. Starting fetch for:", pageUrl);
      try {
        const response = await api.get(`/seo?pageUrl=${pageUrl}`);
        console.log("2. Received API response:", response.data);
        if (response.data && response.data.data) {
          console.log(
            "3. Data is valid. Updating state with:",
            response.data.data,
          );
          setSeo(response.data.data);
        } else {
        console.log(
          "4. Data is NOT valid or missing. State will not be updated.",
        );
        }
      } catch (error) {
        console.error("5. An error occurred in fetchSeoData:", error);
        // If a specific entry isn't found (404), create it from props
        if (error.response && error.response.status === 404 && title) {
          console.log(
            `No specific SEO entry for ${pageUrl}. Using fallback props.`,
          );
          setSeo({
            title: `${title} | Soshell Media`,
            metaDescription: createExcerpt(description),
            ogTitle: `${title} | Soshell Media`,
            ogDescription: createExcerpt(description),
            ogImage: "", // You could add a default OG image URL here
          });
        } else {
          console.error(`Failed to fetch SEO data for ${pageUrl}`, error);
        }
      }
    };

    if (pageUrl) {
      fetchSeoData();
    }
  }, [pageUrl, title, description]);
  // document.title = seo.title;
console.log("6. Rendering component with seo.title:", seo.title);
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.metaDescription} />
      {/* Open Graph / Facebook */}
      {seo.ogTitle && <meta property="og:title" content={seo.ogTitle} />}
      {seo.ogDescription && (
        <meta property="og:description" content={seo.ogDescription} />
      )}
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      {/* You can add more tags here, like Twitter cards */}
    </Helmet>
  );
};

export default SeoHelmet;
