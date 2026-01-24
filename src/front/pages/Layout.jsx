import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { NavVet } from "../components/NavVet"
import { Footer } from "../components/Footer"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
                 <NavVet />
            {/* <Navbar /> */}
                <Outlet />
            <Footer />
        </ScrollToTop>
    )
}