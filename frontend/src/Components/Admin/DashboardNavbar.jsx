import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, ShieldAlert, Sun, Moon, AlertTriangle } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";
import DashboardAvatarSection from "../../common ui/DashboardAvatar";

function DashboardNavbar({ onLogout, toggleSidebarDrawer }) {
  const role = JSON.parse(localStorage.getItem("userDetails"))?.existingUser?.role;
  const { theme, setTheme } = useThemeStore();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-40 bg-base-100/90 backdrop-blur-md text-base-content border-b border-base-content/10 flex items-center justify-between px-6 transition-all duration-300">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebarDrawer}
          className="p-2 rounded-xl hover:bg-base-200 text-base-content hover:text-[#FF7D44] transition-colors focus:outline-none cursor-pointer"
        >
          <Menu className="size-5" />
        </button>
        
        <ShieldAlert className="size-5 text-[#FF7D44]" />
        
        <h1 className="font-black text-lg tracking-tight select-none font-outfit">
          {role === "vendor" ? "Vendor Panel" : role === "admin" ? "Admin Panel" : "My Dashboard"}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl hover:bg-base-200 text-base-content hover:text-[#FF7D44] transition-colors focus:outline-none cursor-pointer"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="size-5 text-yellow-400" />
          ) : (
            <Moon className="size-5 text-gray-500" />
          )}
        </button>

        {/* Avatar */}
        <div>
          <DashboardAvatarSection />
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-error bg-error/10 hover:bg-error hover:text-white rounded-xl border border-error/20 transition-all active:scale-95 font-outfit cursor-pointer"
        >
          <span>Logout</span>
          <LogOut className="size-3.5" />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirm(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative overflow-hidden bg-base-100 rounded-[2rem] border border-base-content/10 max-w-sm w-full p-6 shadow-2xl z-[10000] font-outfit text-center"
              >
                {/* Warning Icon */}
                <div className="mx-auto size-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4">
                  <AlertTriangle className="size-6" />
                </div>

                <h3 className="text-lg font-black text-base-content mb-2">
                  Confirm Logout
                </h3>
                
                <p className="text-xs font-semibold text-base-content/60 mb-6 leading-relaxed">
                  Are you sure you want to log out of Feastify? You will need to sign in again to access bookings.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="w-1/2 btn btn-ghost h-11 rounded-xl font-black text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      onLogout();
                    }}
                    className="w-1/2 btn btn-error h-11 rounded-xl text-white font-black text-xs shadow-lg shadow-error/10 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

export default DashboardNavbar;
