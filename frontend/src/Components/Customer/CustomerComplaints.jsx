import React, { useEffect } from 'react';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserComplaints } from '../../api/user/userActions';

const CustomerComplaints = () => {
  const dispatch = useDispatch();
  const complaints = useSelector((state) => state.user.complaints);

  useEffect(() => {
    dispatch(getUserComplaints());
  }, [dispatch]);

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
      <Typography variant="h4" mb={3}>
        My Complaints
      </Typography>

      <Paper sx={{ borderRadius: "10px", overflow: "clip" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#ED6C02" }}>
              <TableRow>
                <TableCell><strong>Subject</strong></TableCell>
                <TableCell><strong>Message</strong></TableCell>
                <TableCell><strong>Date Submitted</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints && complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <TableRow key={complaint._id} hover>
                    <TableCell>{complaint.subject}</TableCell>
                    <TableCell>{complaint.message}</TableCell>
                    <TableCell>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status}
                        color={complaint.status === "Resolved" ? "success" : "warning"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No complaints found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CustomerComplaints;
