import React, { useState } from "react";
import SideBar from "../Components/Admin/SideBar";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavbar from "../Components/Admin/DashboardNavbar";
import { useDispatch } from "react-redux";
import { logout } from "../api/LoginRegister/loginRegister";

const drawerWidth = 240;

function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      <Box sx={{ display: "flex", flexGrow: 1, bgcolor:'whitesmoke',height:'100%'}}>
      '90%'<SideBar
          open={mobileOpen}
          onclose={handleDrawerToggle}
          isSidebarOpen={isSidebarOpen}
        />
        <Box
          component="main"
          sx={{width:'80%',height:'100%'}}

        >
          <Toolbar />
          <Outlet  />
        </Box>
      </Box>
      </>
  );
}

export default AdminDashboard;
