import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import ReportIcon from "@mui/icons-material/Report";
import { Drawer, Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSelector } from "react-redux";
import { UtensilsCrossed } from "lucide-react";

function SideBar({ open, onclose, isSidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Get user role from Redux or LocalStorage
  const reduxRole = useSelector((state) => state.login.role);
  const localData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const role = reduxRole || localData?.existingUser?.role;

  const adminItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Vendors", icon: <BusinessIcon />, path: "/admin/vendors" },
    { text: "Bookings", icon: <BookOnlineIcon />, path: "/admin/bookings" },
    { text: "Complaints", icon: <ReportIcon />, path: "/admin/complaints" },
  ];

  const vendorItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/vendor/vendorDashboard' },
    { text: 'My Bookings', icon: <BookOnlineIcon />, path: '/vendor/vendorBookings' },
    { text: 'My Services', icon: <RestaurantMenuIcon />, path: '/vendor/vendorServices' },
    { text: 'My Menu', icon: <MenuIcon />, path: '/vendor/vendorMenu' },
  ];

  const userItems = [
    { text: 'Profile', icon: <PeopleIcon />, path: '/user/profile' },
    { text: 'My Bookings', icon: <BookOnlineIcon />, path: '/user/bookings' },
    { text: 'My Complaints', icon: <ReportIcon />, path: '/user/complaints' },
  ];

  const displayItems = role === 'admin' ? adminItems : role === 'vendor' ? vendorItems : userItems;
  const drawerWidth = isSidebarOpen ? 240 : 60;

  // Render Sidebar List Content (used in both drawer and aside)
  const renderSidebarList = () => (
    <div className="flex flex-col h-full w-full justify-between py-6 select-none">
      <div>
        {/* Navigation list */}
        <nav className={`${isSidebarOpen ? "px-3" : "px-1.5"} py-1 space-y-1.5 w-full transition-all duration-300`}>
          {displayItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.text}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center py-3 rounded-xl transition-all duration-200 cursor-pointer text-left border-l-4 ${
                  isSidebarOpen ? "px-4 justify-start" : "px-0 justify-center"
                } ${
                  isActive
                    ? "bg-[#FF7D44]/10 text-[#FF7D44] border-[#FF7D44]"
                    : "text-base-content hover:bg-[#FF7D44]/5 hover:text-[#FF7D44] border-transparent"
                }`}
              >
                <div className={`flex items-center justify-center min-w-[24px] ${isActive ? "text-[#FF7D44]" : "text-base-content/60"}`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-outfit whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isSidebarOpen 
                    ? "opacity-100 max-w-[150px] ml-4" 
                    : "opacity-0 max-w-0 ml-0 pointer-events-none"
                } ${isActive ? "font-black" : "font-semibold"}`}>
                  {item.text}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
  
      {/* Brand Section at bottom */}
      <div className={`flex items-center w-full transition-all duration-300 ${
        isSidebarOpen ? "px-4 justify-start" : "px-0 justify-center"
      }`}>
        <div className="size-10 rounded-xl bg-gradient-to-br from-[#FF7D44] to-[#ff9d6e] flex items-center justify-center shadow-lg transition-transform duration-300 hover:rotate-12 flex-shrink-0">
          <UtensilsCrossed className="size-5 text-white" />
        </div>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
          isSidebarOpen 
            ? "opacity-100 max-w-[120px] ml-3" 
            : "opacity-0 max-w-0 ml-0 pointer-events-none"
        }`}>
          <h4 className="font-black text-sm tracking-tight leading-none whitespace-nowrap">
            <span className="text-[#FF7D44]">FEAST</span><span className="text-base-content">IFY</span>
          </h4>
          <span className="text-[10px] opacity-40 font-black leading-none block mt-1 whitespace-nowrap">
            v2.1 Premium
          </span>
        </div>
      </div>
    </div>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={open}
      anchor="left"
      onClose={onclose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          border: "none",
          backgroundColor: "transparent",
        }
      }}
    >
      <Box className="bg-base-100 text-base-content h-full border-r border-base-content/10">
        <Toolbar sx={{ minHeight: '64px' }} />
        {renderSidebarList()}
      </Box>
    </Drawer>
  ) : (
    <aside
      className="fixed top-16 left-0 h-[calc(100vh-64px)] z-30 transition-all duration-300 ease-in-out bg-base-100/95 backdrop-blur-md border-r border-base-content/10 flex flex-col justify-between shadow-xl"
      style={{ width: `${drawerWidth}px` }}
    >
      {renderSidebarList()}
    </aside>
  );
}

export default SideBar;
