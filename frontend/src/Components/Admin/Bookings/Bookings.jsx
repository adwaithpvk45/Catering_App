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

import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../../../api/admin/adminActions";
import dayjs from "dayjs";

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
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.admin);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose=()=>{
    setDrawerOpen(false)
  }

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

  // Map backend data to DataGrid format
  const formattedBookings = bookings.map((b) => ({
    id: b._id,
    userName: b.user?.fullName || "Unknown User",
    vendorName: b.vendor && b.vendor.length > 0 ? b.vendor[0].vendorName : "Unknown Vendor",
    eventType: b.category,
    eventDate: dayjs(b.eventDate).format("YYYY-MM-DD"),
    location: b.venueLocation,
    status: b.status,
    raw: b // Keep raw data for view modal
  }));

  const filteredUsers = formattedBookings.filter(
    (booking) =>
      booking.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchQuery.toLowerCase())
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
