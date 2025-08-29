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

const SeoHelmet = ({ pageUrl, title, description, keywords, canonical }) => {
  const [seo, setSeo] = useState({
    title: "Soshell Media", // Default title
    metaDescription: "Performance-driven content studio.",
    keywords: "",
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  useEffect(() => {
    if (title) {
      setSeo({
        title: `${title} | Soshell Media`,
        metaDescription: createExcerpt(description),
        keywords: keywords || "",
        canonical: canonical || "",
        ogTitle: `${title} | Soshell Media`,
        ogDescription: createExcerpt(description),
        ogImage: "",
      });
    }

    else if (pageUrl) {
      const fetchSeoData = async () => {
        try {
          const response = await api.get(`/seo?pageUrl=${pageUrl}`);
          if (response.data && response.data.data) {
            setSeo(response.data.data);
          }
        } catch (error) {
          console.error(`Failed to fetch SEO data for ${pageUrl}`, error);
        }
      };
      fetchSeoData();
    }
  }, [pageUrl, title, description, keywords, canonical]);

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.metaDescription} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      {seo.ogTitle && <meta property="og:title" content={seo.ogTitle} />}
      {seo.ogDescription && (
        <meta property="og:description" content={seo.ogDescription} />
      )}
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
    </Helmet>
  );
};

export default SeoHelmet;
