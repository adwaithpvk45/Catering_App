import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BookingDetailsDrawer = ({
  open,
  onClose,
  booking,
  onToggleStatus,
}) => {
  if (!booking) return null;

  const bookingFields = [
    { label: 'User', value: booking.user },
    { label: 'Event', value: booking.event },
    { label: 'Date', value: booking.date },
    { label: 'Contact', value: booking.contact },
    { label: 'Status', value: booking.status },
  ];

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{height:'100vh'}}>
      <Box p={3} width={600} sx={{ marginTop: '80px',position:'relative',height:'100%'}}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h5" fontWeight="bold">
            Booking Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Grid container spacing={2}>
          {bookingFields.map((field, index) => (
            <Grid item xs={12} md={6} key={index}>
              <TextField
                label={field.label}
                value={field.value}
                fullWidth
                disabled
              />
            </Grid>
          ))}
        </Grid>

        {/* Status Button */}
        <Box mt={4} sx={{width:'90%',position:'absolute',bottom:'0px',mb:'30px',height:'50px'}} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            sx={{width:'100%'}}
            onClick={() => {
              onToggleStatus(booking.id);
              onClose();
            }}
          >
            Mark as {booking.status === 'Pending' ? 'Confirmed' : 'Pending'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default BookingDetailsDrawer;

