import React, { useEffect, useState } from "react";
import SideBar from "../Components/Admin/SideBar";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavbar from "../Components/Admin/DashboardNavbar";
import dayjs from 'dayjs'

const drawerWidth = 240;

function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentTime,setCurrentTime] = useState(dayjs())

  useEffect(()=>{
    const timer = setInterval(()=>{
         setCurrentTime(dayjs())
    },1000)

    return ()=> clearInterval(timer)
  },[])

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
    <Box sx={{ display: "flex" }}>
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
          sx={{ p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }}}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
