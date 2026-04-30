import React, { useState } from 'react';
import { Avatar, Typography, Box, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { MoreVerticalIcon } from 'lucide-react';
import { Settings } from '@mui/icons-material';
import ResetPassword from './Drawer';

const DashboardAvatarSection = ({ user }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen,setDrawerOpen] = useState(false)
  
    const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleResetPassword = () => {
    handleMenuClose();
    console.log('Reset password clicked');
  };

const handleOpen=()=>{
    setDrawerOpen(true)
}

const handleClose = () => {
    setDrawerOpen(false)
}

  const handleProfileSettings = () => {
    handleMenuClose();
    // Navigate to profile/settings
    console.log('Profile settings clicked');
  };

//   const user = props?.user || { name: 'Guest' };

  return (
    <Box position="relative" display="inline-block" alignItems="center" gap={2} margin={2} sx={{cursor:'pointer'}}>
      <Avatar
        alt={user?.name}
        src={user?.avatarUrl} 
        sx={{ width: 40, height: 40 }}
      >
        {!user?.avatarUrl && user?.name?.[0]}
      </Avatar>
      {/* <Box>
        <Typography variant="h6">{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role}
        </Typography>
      </Box> */}
      <Box
        position="absolute"
        top={24}
        left={19}
        bgcolor="inherit"
        borderRadius="50%"
        color={'black'}
        zIndex={1}
      >
        <Tooltip title="Options">
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ p: 0 }}
          >
            <Settings/>
          </IconButton>
        </Tooltip>
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleProfileSettings}>Profile Settings</MenuItem>
        <MenuItem onClick={()=>{handleResetPassword(),handleOpen()}}>Reset Password</MenuItem>
      </Menu>
      <ResetPassword open={drawerOpen} handleClose={handleClose} />
    </Box>
  );
};

export default DashboardAvatarSection;