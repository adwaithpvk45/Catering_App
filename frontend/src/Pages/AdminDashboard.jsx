import React, { useState } from "react";
import SideBar from "../Components/Admin/SideBar";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavbar from "../Components/Admin/DashboardNavbar";
import { useDispatch } from "react-redux";
import { logout } from "../api/LoginRegister/loginRegister";

function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch()

  console.log(isSidebarOpen)

  const handleLogout = () => {
    dispatch(logout(navigate))
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <DashboardNavbar
        onLogout={handleLogout}
        toggleDrawer={handleDrawerToggle}
        toggleSidebarDrawer={handleSidebarToggle}
      />
      <Box className="bg-base-200 text-base-content" sx={{ display: "flex", flexGrow: 1, minHeight: '100vh', transition: 'background-color 0.3s ease' }}>
        <SideBar
          open={mobileOpen}
          onclose={handleDrawerToggle}
          isSidebarOpen={isSidebarOpen}
        />
        <Box
          component="main"
          className="transition-all duration-300"
          sx={{ 
            flexGrow: 1, 
            pt: 4,
            pb: 4,
            pr: 4,
            width: '100%', 
            minHeight: '100vh',
            pl: { md: `${(isSidebarOpen ? 240 : 60) + 24}px`, xs: 2 },
            transition: 'padding-left 0.3s ease'
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
      </>
  );
}

export default AdminDashboard;
