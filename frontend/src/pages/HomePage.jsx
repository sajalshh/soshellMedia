import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
// import Services from "../components/Services";
import Projects from "../components/Projects";
import Faq from "../components/Faq";
// import Paralax from "../components/Paralax";
import Counter1 from "../components/counter1"
import Pricing from "../components/Pricing";
import Message from "../components/Message";
import StickyCardScroller from "../components/StickyCardScroller";
import WorkProcess from "../components/WorkProcess";
import Showcase from "../components/Showcase";
import SeoHelmet from "../components/SeoHelmet";

export default function HomePage() {
  return (
    <>
      <SeoHelmet pageUrl="/" />
      <Hero />
      <Counter1 />
      <Showcase />
      <About />
      <StickyCardScroller />
      <Projects />
      <WorkProcess />
      {/* <Pricing /> */}
      <Faq />
      <Message />
    </>
  );
}
