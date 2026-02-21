import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig";
import NotFoundPage from "./NotFoundPage";
import Sidebar from "../components/Sidebar";
import SeoHelmet from "../components/SeoHelmet";


export default function CaseStudyDetailsPage() {
  const { slug } = useParams();
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState([]);
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const response = await api.get(`/casestudies/${slug}`);
        setStudy(response.data.data);
      } catch (error) {
        console.error("Error fetching case study:", error);
        setStudy(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudy();
  }, [slug]);

  // Effect to process content for TOC and remove duplicate title
  useEffect(() => {
    if (!study?.content) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = study.content;

    const firstHeading = tempDiv.querySelector("h1, h2");
    if (firstHeading && firstHeading.innerText.trim() === study.title.trim()) {
      firstHeading.remove();
    }

    const foundHeadings = tempDiv.querySelectorAll("h2, h3");
    const extractedHeadings = [];

    foundHeadings.forEach((heading, index) => {
      const text = heading.innerText;
      const tagName = heading.tagName.toLowerCase();
      const id =
        text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") +
        "-" +
        index;
      heading.setAttribute("id", id);
      extractedHeadings.push({ id, text, tagName });
    });

    setHeadings(extractedHeadings);
    setProcessedContent(tempDiv.innerHTML);
  }, [study]);

  if (loading) {
    return <div className="section-padding">Loading...</div>;
  }

  if (!study) {
    return <NotFoundPage />;
  }

  const imageUrl = study.featuredImage || "/assets/img/blog/post-1.jpg";
  const altText = study.altTag || study.title;

  return (
    <section className="news-details style-padding fix section-padding">
      <SeoHelmet
        title={study.metaTitle || study.title}
        description={study.metaDescription || study.excerpt}
        canonical={study.canonicalTag}
        keywords={study.keywords}
      />

      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="news-details-wrapper">
              <div className="news-details-items">
                <div className="news-details-thumb">
                  <img src={imageUrl} alt={altText} />
                </div>
                <div className="news-details-content">
                  <h1 dangerouslySetInnerHTML={{ __html: study.title }} />
                  <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <Sidebar headings={headings} />
          </div>
        </div>
      </div>
    </section>
  );
}
