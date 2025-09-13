// src/components/SeoHelmet.jsx
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import api from "../api/axiosConfig";

// Helper to strip HTML and create an excerpt
const createExcerpt = (htmlString, length = 155) => {
  if (!htmlString) return "";
  const text = htmlString.replace(/<[^>]+>/g, ""); // strip tags
  if (text.length <= length) return text;
  return text.substr(0, text.lastIndexOf(" ", length)) + "...";
};

// Helper to normalize keywords into a comma-separated string
const normalizeKeywordsToString = (keywords) => {
  if (!keywords) return "";
  if (Array.isArray(keywords)) {
    return keywords
      .map((k) => (typeof k === "string" ? k.trim() : ""))
      .filter(Boolean)
      .join(", ");
  }
  if (typeof keywords === "string") {
    return keywords;
  }
  try {
    return String(keywords);
  } catch {
    return "";
  }
};

const SeoHelmet = ({ pageUrl, title, description, keywords, canonical }) => {
  const [seo, setSeo] = useState({
    title: "Soshell Media",
    metaDescription: "Performance-driven content studio.",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    // --- New State Fields ---
    ogUrl: "",
    ogImageAlt: "",
    canonicalUrl: "",
    schemaMarkup: "",
  });

  useEffect(() => {
    // If title prop provided, use manual props (higher priority)
    if (title) {
      setSeo({
        title: `${title} | Soshell Media`,
        metaDescription: createExcerpt(description),
        keywords: normalizeKeywordsToString(keywords),
        canonicalUrl: canonical || "",
        ogTitle: `${title} | Soshell Media`,
        ogDescription: createExcerpt(description),
        ogImage: "",
        // --- Default new fields for manual mode ---
        ogUrl: "",
        ogImageAlt: "",
        schemaMarkup: "",
      });
      return;
    }

    // Otherwise fetch SEO for the given pageUrl
    if (pageUrl) {
      const fetchSeoData = async () => {
        try {
          const encoded = encodeURIComponent(pageUrl);
          const response = await api.get(`/seo?pageUrl=${encoded}`);
          const data = response?.data?.data;

          if (data) {
            setSeo({
              title: data.title || "Soshell Media",
              metaDescription:
                data.metaDescription || "Performance-driven content studio.",
              keywords: normalizeKeywordsToString(data.keywords),
              ogTitle: data.ogTitle || data.title || "",
              ogDescription: data.ogDescription || data.metaDescription || "",
              ogImage: data.ogImage || "",
              // --- Set new fields from API data ---
              ogUrl: data.ogUrl || "",
              ogImageAlt: data.ogImageAlt || "",
              canonicalUrl: data.canonicalUrl || "",
              schemaMarkup: data.schemaMarkup || "",
            });
          } else {
            setSeo((prev) => ({ ...prev }));
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
      {seo.title && <title>{seo.title}</title>}
      {seo.metaDescription && (
        <meta name="description" content={seo.metaDescription} />
      )}
      {seo.keywords ? <meta name="keywords" content={seo.keywords} /> : null}

      {/* =================== UPDATED & NEW TAGS START =================== */}
      {/* Canonical URL Tag */}
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}

      {/* Open Graph Tags */}
      {seo.ogTitle && <meta property="og:title" content={seo.ogTitle} />}
      {seo.ogUrl && <meta property="og:url" content={seo.ogUrl} />}
      {seo.ogDescription && (
        <meta property="og:description" content={seo.ogDescription} />
      )}
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      {seo.ogImageAlt && (
        <meta property="og:image:alt" content={seo.ogImageAlt} />
      )}

      {/* Twitter card fallbacks */}
      {seo.ogTitle && <meta name="twitter:title" content={seo.ogTitle} />}
      {seo.ogDescription && (
        <meta name="twitter:description" content={seo.ogDescription} />
      )}
      {seo.ogImage && <meta name="twitter:image" content={seo.ogImage} />}

      {/* JSON-LD Schema Markup Script */}
      {seo.schemaMarkup && (
        <script type="application/ld+json">{seo.schemaMarkup}</script>
      )}
      {/* =================== UPDATED & NEW TAGS END =================== */}
    </Helmet>
  );
};

export default SeoHelmet;
