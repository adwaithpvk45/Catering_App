import { Visibility, Block, CheckCircle, Warning } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";


export default function TableContent({filteredUsers,handleBlockUnblock}){
    console.log(filteredUsers)

    return (
        <TableContainer component={Paper} sx={{borderRadius:'10px'}}>
        <Table>
          <TableHead sx={{backgroundColor:"#ED6C02"}}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.createdTime}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <Visibility />
                  </IconButton>

                  {user.status === "active" ? (
                    <IconButton color="error" onClick={() => handleBlockUnblock(user.id, "block")}>
                      <Block />
                    </IconButton>
                  ) : (
                    <IconButton color="success" onClick={() => handleBlockUnblock(user.id, "unblock")}>
                      <CheckCircle />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    )

}