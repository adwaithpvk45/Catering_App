import React, { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import TableContent from "../../../common ui/Table";
import UserDetails from "./UserDetails";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../api/admin/adminActions";
import dayjs from "dayjs";

const UsersList = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen,setDrawerOpen] = useState(false)
  const [selectedUser,setSelectedUser] = useState(null)

    const handleDrawerClose=()=>{
        setDrawerOpen(false)
    }

    const handleDrawerOpen = (data) =>{
      setSelectedUser(data)
      setDrawerOpen(true)
    }

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleBlockUnblock = (id, action) => {
    console.log(`User ${id} ${action}`);
  };

  const formattedUsers = users.map(user => ({
    id: user._id,
    name: user.fullName || "Unknown User",
    email: user.email,
    status: user.status || "active",
    createdTime: dayjs(user.createdAt).format("YYYY-MM-DD")
  }));

  const filteredUsers = formattedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{paddingY:'30px',maxWidth:"90%"}}>
      <Typography variant="h4" mb={3}>Users Management</Typography>

      <Box mb={2} sx={{display:'flex',justifyContent:'flex-end', width:'300px',height:'70px'}}>
        <TextField
          label="Search Vendors"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
            />
      </Box>

     <TableContent filteredUsers={filteredUsers} handleBlockUnblock={handleBlockUnblock} handleDrawerOpen={handleDrawerOpen}/>
     <UserDetails open={drawerOpen} onClose={handleDrawerClose} selectedUser={selectedUser} user={"user"}/>   
    </Box>
  );
};

export default UsersList;