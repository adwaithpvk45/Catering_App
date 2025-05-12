import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  Box,
  TextField
} from '@mui/material';

const VendorBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([
    {
      id: 1,
      user: 'Alice K',
      event: 'Wedding',
      date: '2025-05-18',
      status: 'Pending',
      contact: 'alice@example.com',
    },
    {
      id: 2,
      user: 'Ravi S',
      event: 'Birthday',
      date: '2025-05-22',
      status: 'Confirmed',
      contact: 'ravi@gmail.com',
    },
    {
      id: 3,
      user: 'Renu Thomas',
      event: 'Anniversary',
      date: '2025-05-30',
      status: 'Pending',
      contact: 'renu.t@gmail.com',
    },
  ]);

  const toggleStatus = (id) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: booking.status === 'Pending' ? 'Confirmed' : 'Pending',
            }
          : booking
      )
    );
  };

  const filteredBookings = bookings.filter((b) =>
    [b.user, b.event, b.contact].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ paddingY: '30px', maxWidth: '100%' }}>
      <Typography variant="h4" mb={3}>
        My Bookings
      </Typography>

      <Box sx={{ width: '100%' }}>
        <TextField
          label="Search Bookings"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: '30px', maxWidth: '300px' }}
        />
      </Box>

      <Paper sx={{ borderRadius: '10px', overflow: 'clip' }}>
        <TableContainer sx={{ borderRadius: '10px', overflow: 'clip' }}>
          <Table>
            <TableHead sx={{backgroundColor:"#ED6C02"}}>
              <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Event</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Contact</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.event}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.contact}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      color={booking.status === 'Confirmed' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleStatus(booking.id)}
                    >
                      Mark as {booking.status === 'Pending' ? 'Confirmed' : 'Pending'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default VendorBookings;
