import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import CustomCursor from "./CustomCursor"; // Should be imported

export default function Layout() {
  return (
    <>
      <CustomCursor /> {/* Should be here */}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTopButton />
    </>
  );
}
