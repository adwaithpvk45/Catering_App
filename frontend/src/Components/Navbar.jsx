import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useSelector } from "react-redux";
import { Sun, Moon, UtensilsCrossed, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { isAuthenticated, loginData } = useSelector((state) => state.login);
  const user = loginData?.existingUser || JSON.parse(localStorage.getItem("userDetails"))?.existingUser;
  const role = user?.role;
  
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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
            {['Home', 'About', 'Services', 'Food', 'Contact'].map((item) => (
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
          {['Home', 'About', 'Services', 'Food', 'Contact'].map((item) => (
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

        {/* Auth Actions: Login or User Profile */}
        {!locationPath && (
          role ? (
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-base-content/5 hover:bg-base-content/10 transition-all border border-base-content/5"
              >
                <div className="size-10 rounded-xl bg-[#FF7D44] flex items-center justify-center text-white font-black shadow-lg">
                  {JSON.parse(localStorage.getItem("userDetails"))?.existingUser?.name?.[0] || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Welcome</div>
                  <div className="text-sm font-black leading-none">
                    {JSON.parse(localStorage.getItem("userDetails"))?.existingUser?.name || "User"}
                  </div>
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-[2rem] w-64 mt-4 border border-base-content/5 z-[100]">
                <li className="menu-title px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Account Management</li>
                <li>
                  <Link to="/dashboard" className="flex items-center gap-3 py-4 rounded-xl hover:bg-[#FF7D44]/5 group">
                    <div className="size-10 rounded-xl bg-base-200 flex items-center justify-center group-hover:bg-[#FF7D44] group-hover:text-white transition-colors">
                      <User className="size-5" />
                    </div>
                    <div>
                      <div className="font-black text-sm">My Dashboard</div>
                      <div className="text-[10px] font-medium opacity-50 italic">View your bookings</div>
                    </div>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      localStorage.removeItem("userDetails");
                      window.location.href = "/";
                    }}
                    className="flex items-center gap-3 py-4 rounded-xl hover:bg-error/5 group mt-2"
                  >
                    <div className="size-10 rounded-xl bg-error/10 text-error flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
                      <LogOut className="size-5" />
                    </div>
                    <div className="font-black text-sm text-error">Logout</div>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login">
              <button
                className={`bg-[#FF7D44] hover:bg-[#e66a35] text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl font-black shadow-lg shadow-orange-500/20 transition-all active:scale-95 whitespace-nowrap ${
                  scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                }`}
              >
                Login
              </button>
            </Link>
          )
        )}
      </div>
    </motion.div>
  );
}

export default Navbar;
