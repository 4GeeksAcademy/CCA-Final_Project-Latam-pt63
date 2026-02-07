import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { NavVet } from "../components/NavVet";
import { Footer } from "../components/Footer";
import { AdminNavbar } from "../components/AdminNavbar";
import { useState } from "react";
import { useEffect } from "react";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
  const [role, setRole] = useState(localStorage.getItem("role"));
  useEffect(() => {
    const updateRole = () => {
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", updateRole);
    window.addEventListener("storageUpdate", updateRole);
    return () => {
      window.removeEventListener("storage", updateRole);
      window.removeEventListener("storageUpdate", updateRole);
    };
  }, []);

  if (role == "admin") {
    return (
      <ScrollToTop>
        <AdminNavbar />
        <Outlet />
      </ScrollToTop>
    );
  } else {
    return (
      <ScrollToTop>
        <NavVet />
        {/* <Navbar /> */}
        <Outlet />
        <Footer />
      </ScrollToTop>
    );
  }
};
