import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Faq from "../components/Faq";
import Paralax from "../components/Paralax";
import Pricing from "../components/Pricing";
import Message from "../components/Message";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Projects />
      <Faq />
      <Paralax />
      <Pricing />
      <Message />
    </>
  );
}
