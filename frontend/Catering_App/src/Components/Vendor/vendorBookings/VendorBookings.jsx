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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import BookingDetailsDrawer from './VendorBookingsDrawer';

const VendorBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('All');

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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter((b) =>
    [b.user, b.event, b.contact].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    ) && (eventFilter === 'All' || b.event === eventFilter)
  );

  // Get unique event types dynamically
  const eventTypes = ['All', ...new Set(bookings.map((b) => b.event))];

  return (
    <Box sx={{ paddingY: '30px', maxWidth: '100%' }}>
      <Typography variant="h4" mb={3}>
        My Bookings
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <TextField
          label="Search Bookings"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '300px' }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Event</InputLabel>
          <Select
            value={eventFilter}
            label="Filter by Event"
            onChange={(e) => setEventFilter(e.target.value)}
          >
            {eventTypes.map((event) => (
              <MenuItem key={event} value={event}>
                {event}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ borderRadius: '10px', overflow: 'clip' }}>
        <TableContainer sx={{ borderRadius: '10px', overflow: 'clip' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#ED6C02' }}>
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
                <TableRow
                  key={booking.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRowClick(booking)}
                >
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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        toggleStatus(booking.id);
                      }}
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

      <BookingDetailsDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        booking={selectedBooking}
        onToggleStatus={toggleStatus}
      />
    </Box>
  );
};

export default VendorBookings;
