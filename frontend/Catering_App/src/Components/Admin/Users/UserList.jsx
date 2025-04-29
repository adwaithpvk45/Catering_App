import React, { useEffect, useState } from "react";
import { Box, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, TextField } from "@mui/material";
import TableContent from "../../../common ui/Table";
import UserDetails from "./UserDetails";

const UsersList = () => {
  const [users, setUsers] = useState([]);
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

  // Fetch users (dummy for now)
  useEffect(() => {
    // API call will go here later
    setUsers([
      { 
        id: 1, 
        name: "John Doe", 
        email: "john@example.com", 
        status: "active", 
        createdTime: new Date().toISOString().split('T')[0]      },
      { 
        id: 2, 
        name: "Jane Smith", 
        email: "jane@example.com", 
        status: "blocked", 
        createdTime: new Date().toISOString().split('T')[0]      },
    ])
  }, []);

  const handleBlockUnblock = (id, action) => {
    console.log(`User ${id} ${action}`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{paddingY:'30px',maxWidth:"100%"}}>
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
     <UserDetails open={drawerOpen} onClose={handleDrawerClose} selectedUser={selectedUser} />   
    </Box>
  );
};

export default UsersList;