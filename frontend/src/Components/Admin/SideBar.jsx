import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import ReportIcon from "@mui/icons-material/Report";
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from "react-redux";

function SideBar({ open, onclose, isSidebarOpen }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selected, setSelected] = useState(0);

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

  const displayItems = role === 'admin' ? adminItems : vendorItems;

  const drawerWidth = isSidebarOpen ? 240 : 60;

  const drawerContent = (
    <Box
      sx={{
        maxWidth: '100%',
        width: drawerWidth,
        transition: "width 0.3s ease",
        height: "100%",
        bgcolor: 'wheat',
        border: '1px whitesmoke solid'
      }}
    >
      <Toolbar />
      <Box>
        <List sx={{ marginBottom: '300px', margin: 0 }}>
          {displayItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              onClick={() => { navigate(item.path); setSelected(index); }}
              sx={{
                pb: 2,
                mb: 5,
                justifyContent: isSidebarOpen ? "initial" : "center",
                "&:hover": { cursor: "pointer" },
                color: selected === index ? 'black' : 'inherit',
                backgroundColor: selected === index ? 'whitesmoke' : 'inherit',
                borderTopRightRadius: '10px'
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSidebarOpen ? 2 : "auto",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '24px'
                }}
                sx={{
                  opacity: isSidebarOpen ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            </ListItem>
          ))}
        </List>
      <img
        src="/Feastify.png"
        className="h-11 w-11 m-2 block rounded-3xl"
        alt="logo"
      ></img> 
      </Box>
    </Box>
  );

  return isMobile ? (
    <div className="p-4" >
      {/* <IconButton onClick={() => setOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>  */}
      <Drawer
        variant="temporary"
        open={open}
        anchor="left"
        onClose={onclose}
        ModalProps={{ keepMounted: true }}
        sx={{
          border:'1px whitesmoke solid'
        }}
       >
        {drawerContent}
      </Drawer>
    </div>
  ) : (
    <div className="p-4">
      {/* <IconButton onClick={() => setOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>  */}
      <Drawer
        variant="permanent"
        anchor="left"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.3s ease",
          },
          border:'1px whitesmoke solid'
        }}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}

export default SideBar;
