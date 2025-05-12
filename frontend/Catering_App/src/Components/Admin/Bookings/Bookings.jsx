// AdminBookings.jsx
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Chip,
  Drawer,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import UserDetails from "../Users/UserDetails";

const dummyBookings = [
  {
    id: 1,
    userName: "John Doe",
    vendorName: "Tasty Treats",
    eventType: "Wedding",
    eventDate: "2025-06-15",
    location: "City Hall",
    status: "Pending",
  },
  {
    id: 2,
    userName: "Jane Smith",
    vendorName: "Spicy Kitchen",
    eventType: "Birthday",
    eventDate: "2025-07-01",
    location: "Garden Venue",
    status: "Approved",
  },
];

const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    case "Completed":
      return "primary";
    default:
      return "default";
  }
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState(dummyBookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose=()=>{
    setDrawerOpen(false)
}

  const handleStatusChange = (e) => {
    const updated = bookings.map((b) =>
      b.id === selectedBooking.id ? { ...b, status: e.target.value } : b
    );
    setBookings(updated);
    setSelectedBooking((prev) => ({ ...prev, status: e.target.value }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "userName", headerName: "User", flex: 1 },
    { field: "vendorName", headerName: "Vendor", flex: 1 },
    { field: "eventType", headerName: "Event Type", flex: 1 },
    { field: "eventDate", headerName: "Date", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip label={params.value} color={statusColor(params.value)} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleView(params.row)}>
          View
        </Button>
      ),
    },
  ];

  const filteredUsers = dummyBookings.filter(
    (user) =>
      user.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
      <Typography variant="h4" mb={3}>
        Bookings Management
      </Typography>
      <Box style={{ width: "100%" }}>
        <TextField
          label="Search Vendors"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: "30px", maxWidth: "300px" }}
        />
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={5}
          columnBuffer={0}
        />
      </Box>

      {selectedBooking && (
        <UserDetails
          open={drawerOpen}
          onClose={handleDrawerClose}
          selectedUser={selectedBooking}
          user={"bookings"}
        />
      )}
    </Box>
  );
};

export default AdminBookings;
