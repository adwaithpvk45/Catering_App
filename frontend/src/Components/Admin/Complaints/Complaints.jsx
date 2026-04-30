import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, Typography, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  Stack,
  Box,
  Divider,
  TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getComplaints, updateStatus } from '../../../api/admin/adminActions';
import toast from 'react-hot-toast';

const AdminComplaintsSection = () => {
  const dispatch = useDispatch();
  const { complaints } = useSelector((state) => state.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getComplaints()).finally(() => setLoading(false));
  }, [dispatch]);


  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    dispatch(updateStatus(id, newStatus));
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleClose = () => {
    setSelectedComplaint(null);
  };

  

  return (

     <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
          <Typography variant="h4" mb={3}>
            Complaints Management
          </Typography>
          <Box style={{ width: "100%" }}>
            <TextField
              label="Search Complaints"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: "30px", maxWidth: "300px" }}
            />
                  </Box>
            
     <Paper sx={{borderRadius:'10px',overflow:'clip'}}>
        <TableContainer sx={{borderRadius:'10px',overflow:'clip'}}>
          <Table>
            <TableHead sx={{backgroundColor:"#ED6C02"}}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints
                .filter(c => 
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  c.subject.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell>
                    <Chip
                      label={c.status}
                      color={c.status === 'Resolved' ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleView(c)}
                      sx={{ marginRight: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleStatus(c._id, c.status)}
                    >
                      Mark as {c.status === 'Pending' ? 'Resolved' : 'Pending'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {complaints.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No complaints found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>
        
        

      <Dialog open={Boolean(selectedComplaint)} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Complaint Details</DialogTitle>
        <DialogContent dividers>
          {selectedComplaint && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{selectedComplaint.name}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedComplaint.email}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Subject</Typography>
                <Typography variant="body1">{selectedComplaint.subject}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                <Typography variant="body1">{selectedComplaint.message}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={selectedComplaint.status}
                  color={selectedComplaint.status === 'Resolved' ? 'success' : 'warning'}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
            </Box>
      
  );
};

export default AdminComplaintsSection;

