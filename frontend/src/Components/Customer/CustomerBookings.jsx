import React, { useEffect } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '../../api/user/userActions';

const CustomerBookings = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.user.Booking);

  useEffect(() => {
    dispatch(getUserBookings());
  }, [dispatch]);

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
      <Typography variant="h4" mb={3}>
        My Bookings
      </Typography>

      <Paper sx={{ borderRadius: "10px", overflow: "clip" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#ED6C02" }}>
              <TableRow>
                <TableCell><strong>Vendor</strong></TableCell>
                <TableCell><strong>Event Date</strong></TableCell>
                <TableCell><strong>Venue</strong></TableCell>
                <TableCell><strong>Guests</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking._id} hover>
                    <TableCell>{booking.vendor?.vendorName || "Unknown Vendor"}</TableCell>
                    <TableCell>
                      {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>{booking.venueLocation || "N/A"}</TableCell>
                    <TableCell>{booking.guestCount || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={
                          booking.status === "Accepted"
                            ? "success"
                            : booking.status === "Cancelled"
                            ? "error"
                            : booking.status === "Pending"
                            ? "warning"
                            : "default"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">No bookings found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CustomerBookings;
