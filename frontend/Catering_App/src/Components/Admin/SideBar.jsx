import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ReportIcon from "@mui/icons-material/Report";
import {
  AppBar,
  Box,
  Drawer,
  // IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// import { useState } from "react";
// import { MenuIcon, Pointer } from "lucide-react";

function SideBar({ open, onclose, isSidebarOpen }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const items = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Vendors", icon: <BusinessIcon />, path: "/admin/vendors" },
    { text: "Bookings", icon: <BookOnlineIcon />, path: "/admin/bookings" },
    { text: "Complaints", icon: <ReportIcon />, path: "/admin/complaints" },
  ];

  const drawerWidth = isSidebarOpen ? 240 : 60;

  const drawerContent = (
    <Box
      sx={{
        maxWidth:'100%',
        width: drawerWidth,
        overflowX:'clip',
        transition: "width 0.3s ease",
        height: "100%",
        bgcolor:'wheat',
      }}
    >
      <Toolbar/>
      <Box >
      <List sx={{marginBottom:'300px'}}>
        {items.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              px: 2,
              justifyContent: isSidebarOpen ? "initial" : "center",
              "&:hover": { cursor: "pointer" },
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
       sx={{bgcolor:'wheat'}}>
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
        }}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}

export default SideBar;
