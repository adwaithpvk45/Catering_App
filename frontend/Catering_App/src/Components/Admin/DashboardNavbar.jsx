import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import React from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { LogOutIcon, MenuIcon } from "lucide-react";
import DashboardAvatarSection from "../../common ui/DashboardAvatar";

function DashboardNavbar({ onLogout, toggleDrawer, toggleSidebarDrawer }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const role = JSON.parse(localStorage.getItem("userDetails"))?.existingUser
    ?.role;
  console.log("🚀 ~ DashboardNavbar ~ role:", role);

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
            {role === "vendor" ? "Vendor Panel" : "Admin Panel"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Tooltip>
              <DashboardAvatarSection />
            </Tooltip>
          </Box>
          <Button color="inherit" endIcon={<LogOutIcon />} onClick={onLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardNavbar;
