import { Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useDispatch, useSelector } from 'react-redux';
import { getVendorStats } from '../../api/vendor/vendorActions';

function VendorDashboardStats() {
  const dispatch = useDispatch();
  const { stats, errors } = useSelector((state) => state.vendor);

  useEffect(() => {
    dispatch(getVendorStats());
  }, [dispatch]);
  
  const vendorStats = [
    { label: "Total Bookings", value: stats?.totalBookings || 0, icon: <BookOnlineIcon color="success" sx={{fontSize:50}}/> },
    { label: "My Services", value: stats?.totalServices || 0, icon: <RestaurantMenuIcon color="secondary" sx={{fontSize:50}}/> },
  ];

  return (
    <Box sx={{p:4, maxWidth:"100%"}}>
      <Typography variant="h4" mb={3}>
        Vendor Dashboard
      </Typography>

      {/* Top Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {vendorStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, boxShadow: 3 ,height:'100%'}}>
              <Box sx={{ mr: 2 }}>{stat.icon}</Box>
              <CardContent sx={{ flex: 1 }}>
                <Typography color="textSecondary" variant="subtitle1">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats ? stat.value : <CircularProgress size={20} />}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {errors && (
         <Typography color="error" variant="body1">
            Failed to load stats: {errors.message || "Unknown error"}
         </Typography>
      )}

    </Box>
  )
}

export default VendorDashboardStats;
