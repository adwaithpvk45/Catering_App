import React, { useState } from "react";
import SideBar from "../Components/Admin/SideBar";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavbar from "../Components/Admin/DashboardNavbar";

const drawerWidth = 240;

function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log(isSidebarOpen)

  const handleLogout = () => {
    //cookie logic to logout
    navigate("/Home");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex"}}>
      <DashboardNavbar
        onLogout={handleLogout}
        toggleDrawer={handleDrawerToggle}
        toggleSidebarDrawer={handleSidebarToggle}
      />
      <Box sx={{ display: "flex", flexGrow: 1, bgcolor:'whitesmoke'}}>
        <SideBar
          open={mobileOpen}
          onclose={handleDrawerToggle}
          isSidebarOpen={isSidebarOpen}
        />
        <Box
          component="main"
          // sx={{width: { sm: `calc(100% - ${drawerWidth}px)` }}}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
