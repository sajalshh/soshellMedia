import React, { Suspense, lazy } from "react";
import SeoHelmet from "../components/SeoHelmet";
import Hero from "../components/Hero";

// ==========================================
// LAZY LOADED COMPONENTS (Below the fold)
// ==========================================
const Showcase = lazy(() => import("../components/Showcase"));
const About = lazy(() => import("../components/About"));
const AiTestCall = lazy(() => import("../components/AiTestCall"));
const StickyCardScroller = lazy(() =>
  import("../components/StickyCardScroller"),
);
const WorkProcess = lazy(() => import("../components/WorkProcess"));
const AIOperationalAgents = lazy(() =>
  import("../components/AIOperationalAgents"),
);
const Pricing = lazy(() => import("../components/Pricing"));
const Message = lazy(() => import("../components/Message"));

// If you ever uncomment these, here is how you lazy load them:
// const Projects = lazy(() => import("../components/Projects"));
// const Faq = lazy(() => import("../components/Faq"));
// const Services = lazy(() => import("../components/Services"));
// const Paralax = lazy(() => import("../components/Paralax"));

export default function HomePage() {
  return (
    <>
      {/* CRITICAL: SeoHelmet and Hero are NOT lazy-loaded. 
        They must render immediately for SEO and initial page load.
      */}
      <SeoHelmet pageUrl="/" />
      <Hero />

      {/* SUSPENSE BOUNDARY: 
        Tells React to wait until the user scrolls near or until the browser 
        is idle before downloading and rendering these components.
      */}
      <Suspense
        fallback={
          <div style={{ minHeight: "100vh", backgroundColor: "#0f0f11" }}></div>
        }
      >
        <Showcase />
        <About />
        <AiTestCall />
        <StickyCardScroller />
        <WorkProcess />
        <AIOperationalAgents />
        {/* <Projects /> */}
        <Pricing />
        {/* <Faq /> */}
        <Message />
      </Suspense>
    </>
  );
}
