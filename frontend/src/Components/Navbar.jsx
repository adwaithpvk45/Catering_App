import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { Sun, Moon, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  const role = JSON.parse(localStorage.getItem("userDetails"))?.existingUser
    ?.role;

  const locationPath =
    location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/forgot-password" || location.pathname.startsWith("/reset-password");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div 
      initial={false}
      animate={{
        height: scrolled ? "64px" : "80px",
        backgroundColor: scrolled 
          ? (theme === "dark" ? "rgba(29, 35, 42, 0.8)" : "rgba(255, 255, 255, 0.8)") 
          : (theme === "dark" ? "rgb(29, 35, 42)" : "rgb(255, 255, 255)"),
        backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        boxShadow: scrolled ? "0 4px 20px -2px rgba(0,0,0,0.1)" : "0 0px 0px rgba(0,0,0,0)"
      }}
      transition={{ duration: 0.3 }}
      className="navbar fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 border-b border-transparent data-[scrolled=true]:border-base-content/5"
      data-scrolled={scrolled}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-2xl border border-base-content/5"
          >
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className={`text-lg font-semibold hover:text-[#FF7D44] ${
                    location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? "text-[#FF7D44]" : ""
                  }`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Logo Branding */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <motion.div 
            animate={{ scale: scrolled ? 0.9 : 1 }}
            className="size-9 sm:size-10 rounded-xl bg-gradient-to-br from-[#FF7D44] to-[#ff9d6e] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300"
          >
            <UtensilsCrossed className="size-5 sm:size-6 text-white" />
          </motion.div>
          <span className={`font-black tracking-tighter hidden lg:block transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
            <span className="text-[#FF7D44]">FEAST</span>
            <span className="text-base-content">IFY</span>
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-8">
          {['Home', 'About', 'Services', 'Contact'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className={`relative group font-bold tracking-tight text-lg transition-colors duration-300 ${
                location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? "text-[#FF7D44]" : "hover:text-[#FF7D44]"
              }`}
            >
              {item}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#FF7D44] transition-all duration-300 ${
                location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="btn btn-ghost btn-circle hover:bg-base-content/5"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="size-5 text-yellow-400" />
          ) : (
            <Moon className="size-5 text-gray-600" />
          )}
        </button>

        <Link to={"/login"}>
          <button
            className={`btn btn-warning shadow-md transition-all duration-300 ${scrolled ? 'btn-sm sm:btn-md' : 'btn-md'}`}
            style={{ visibility: locationPath || role ? "hidden" : "visible" }}
          >
            Login
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default Navbar;
