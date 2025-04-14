import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { LogOutIcon, MenuIcon } from "lucide-react";


function DashboardNavbar({onLogout,toggleDrawer,toggleSidebarDrawer}) {
    

      const theme = useTheme()
      const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <AppBar
      position="fixed"
      color="warning"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={isMobile ? toggleDrawer : toggleSidebarDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <AdminPanelSettingsIcon />
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Box>
        <Button color="inherit" endIcon={<LogOutIcon />} onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardNavbar;
