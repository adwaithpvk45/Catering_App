import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getVendors } from "../../../api/admin/adminActions";
import dayjs from "dayjs";

import TableContent from "../../../common ui/Table";
import UserDetails from "../Users/UserDetails";

export default function VendorsList() {
  const dispatch = useDispatch();
  const { vendors } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDrawerOpen = (data) => {
    setSelectedUser(data);
    setDrawerOpen(true);
  };

  useEffect(() => {
    dispatch(getVendors());
  }, [dispatch]);

  const handleBlockUnblock = (id, action) => {
    console.log(`User ${id} ${action}`);
  };

  const formattedVendors = vendors.map(vendor => ({
    id: vendor._id,
    name: vendor.vendorName || "Unknown Vendor",
    email: vendor.userId?.email || "No Email",
    status: vendor.isApproved ? "active" : "pending",
    createdTime: dayjs(vendor.createdAt).format("YYYY-MM-DD")
  }));

  const filteredUsers = formattedVendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%", height:'100%'}}>
      <Typography variant="h4" mb={3}>
        Vendors Management
      </Typography>

      <Box
        mb={2}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "300px",
          height: "70px",
        }}
      >
        <TextField
          label="Search users"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <TableContent
        filteredUsers={filteredUsers}
        handleBlockUnblock={handleBlockUnblock}
        handleDrawerOpen={handleDrawerOpen}
      />
      <UserDetails
        open={drawerOpen}
        onClose={handleDrawerClose}
        selectedUser={selectedUser}
        user={"vendor"}
      />
    </Box>
  );
}
