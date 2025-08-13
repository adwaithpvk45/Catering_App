import React, { useState } from "react";
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
  Select,
} from "@mui/material";
import BookingDetailsDrawer from "./VendorBookingsDrawer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getVendorBookings,
  statusChange,
} from "../../../api/vendor/bookingApi";

const VendorBookings = () => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const bookings = useSelector((state) => state.booking.booking);
  console.log("🚀 ~ VendorBookings ~ bookings:", bookings);

  useEffect(() => {
    dispatch(getVendorBookings(id));
  }, [dispatch]);

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      [b.category, b.venueLocation].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (eventFilter === "All" || b.event === eventFilter)
  );

  // Get unique event types dynamically
  const eventTypes = ["All", ...new Set(bookings.map((b) => b.event))];

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
      <Typography variant="h4" mb={3}>
        My Bookings
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          label="Search Bookings"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: "300px" }}
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

      <Paper sx={{ borderRadius: "10px", overflow: "clip" }}>
        <TableContainer sx={{ borderRadius: "10px", overflow: "clip" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#ED6C02" }}>
              <TableRow>
                <TableCell>
                  <strong>User</strong>
                </TableCell>
                <TableCell>
                  <strong>Services</strong>
                </TableCell>
                <TableCell>
                  <strong>Event Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Guest Count</strong>
                </TableCell>
                <TableCell>
                  <strong>Venue</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(booking)}
                >
                  {/* User Name */}
                  <TableCell>{booking.user?.name || "N/A"}</TableCell>

                  {/* Services - join names */}
                  <TableCell>
                    {booking.services?.map((s) => s.name).join(", ") ||
                      "No services"}
                  </TableCell>

                  {/* Event Date */}
                  <TableCell>
                    {booking.eventDate
                      ? new Date(booking.eventDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>

                  {/* Guest Count */}
                  <TableCell>{booking.guestCount || "-"}</TableCell>

                  {/* Venue Location */}
                  <TableCell>{booking.venueLocation || "N/A"}</TableCell>

                  {/* Status */}
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

                  {/* Actions */}
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        dispatch(
                          statusChange({
                            id: booking._id,
                            status:
                              booking.status === "Pending"
                                ? "Accepted"
                                : "Pending",
                          })
                        );
                      }}
                    >
                      Mark as{" "}
                      {booking.status === "Pending" ? "Accepted" : "Pending"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
      />
    </Box>
  );
};

export default VendorBookings;
