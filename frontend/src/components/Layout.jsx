import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import CustomCursor from "./CustomCursor";

// ✅ Add this import
import WhatsAppWidget from "../components/WhatsAppFloat"
// OR if you used simple button version:
// import WhatsAppFloat from "./WhatsAppFloat";

export default function Layout() {
  return (
    <>
      <CustomCursor />
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />

      <WhatsAppWidget />


      <BackToTopButton />
    </>
  );
}
