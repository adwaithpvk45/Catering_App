import { Box, Drawer, IconButton, TextField, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function UserDetails({ open, onClose, selectedUser,user}) {
  console.log("🚀 ~ UserDetails ~ selectedUser:", selectedUser)
  
  if (!selectedUser) {
    return null;
  }
  const userFields = [
    { label: "Name", value: selectedUser.name },
    { label: "Email", value: selectedUser.email },
    { label: "Phone", value: selectedUser.phone },
    { label: "Status", value: selectedUser.status },
    { label: "Created At", value: selectedUser.createdTime },
  ];

  const booking = [
    { label: "User", value: selectedUser.userName },
    { label: "Vendor", value: selectedUser.vendorName },
    { label: "Event Type", value: selectedUser.eventType },
    { label: "Event Date", value: selectedUser.eventDate },
    { label: "Location", value: selectedUser.location },
    { label: "Status", value: selectedUser.createdTime },
  ]

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={3} width={600} sx={{ marginTop: "80px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold",alignContent:'center'}}
          InputProps={{
            sx: {
              color: "black", 
            },
          }}
        >
          {user=="user"?"User Details":user=='vendor'?"Vendor Details":"Booking Detail"}
        </Typography>
        <IconButton onClick={()=>{onClose()}}>
        <CloseIcon />
      </IconButton>
      </Box>
        <Grid container spacing={2}>
          {(user=="bookings"?booking:userFields).map((field, index) => (
            <Grid item xs={12} md={6} key={index}>
              <TextField
                label={field.label}
                value={field.value}
                fullWidth
                disabled
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Drawer>
  );
}
