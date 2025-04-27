import { Box, Drawer, Typography } from "@mui/material";

export default function UserDetails({open,onClose,selectedUser}){

  return(
    <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        
      >
        <Box p={3} width={600} sx={{marginTop:'80px'}}>
          <Typography variant="h5" mb={2}>User Details</Typography>
          {selectedUser && (
            <>
              <Typography><strong>Name:</strong> {selectedUser.name}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedUser.phone}</Typography>
              <Typography><strong>Status:</strong> {selectedUser.status}</Typography>
              <Typography><strong>Created At:</strong> {selectedUser.createdAt}</Typography>
            </>
          )}
        </Box>
      </Drawer>
  )
}