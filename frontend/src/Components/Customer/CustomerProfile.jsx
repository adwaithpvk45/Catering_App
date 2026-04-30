import React from 'react';
import { Box, Typography, Paper, Grid, Avatar } from '@mui/material';

const CustomerProfile = () => {
  const localData = JSON.parse(localStorage.getItem("userDetails")) || {};
  const user = localData?.existingUser || {};

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
      <Typography variant="h4" mb={3}>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: "10px", display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
        <Avatar 
          src={user.profilePic || "/default-avatar.png"} 
          sx={{ width: 150, height: 150, mb: { xs: 2, md: 0 } }} 
        />
        <Box sx={{ flex: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
              <Typography variant="h6">{user.name || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Email Address</Typography>
              <Typography variant="h6">{user.email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">Role</Typography>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{user.role || "User"}</Typography>
            </Grid>
            {user.role === 'vendor' && (
               <Grid item xs={12} sm={6}>
                 <Typography variant="subtitle2" color="textSecondary">Vendor Name</Typography>
                 <Typography variant="h6">{user.vendorName || "N/A"}</Typography>
               </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerProfile;
