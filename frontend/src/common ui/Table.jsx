import { Visibility, Block, CheckCircle, Warning } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";


export default function TableContent({filteredUsers,handleBlockUnblock,handleDrawerOpen}){
    console.log(filteredUsers)

    return (
        <TableContainer 
          component={Paper} 
          sx={{
            borderRadius: '20px', 
            height: 'calc(100vh - 280px)', 
            overflowY: 'auto',
            border: '1px border-base-content/10',
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            backgroundColor: 'var(--bg-base-100)',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontFamily: 'Outfit, sans-serif', 
                  fontWeight: 900, 
                  fontSize: '13px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  backgroundColor: 'var(--bg-base-200)',
                  color: 'var(--text-base-content)',
                  opacity: 0.8,
                  py: 2.5
                }}>Name</TableCell>
                <TableCell sx={{ 
                  fontFamily: 'Outfit, sans-serif', 
                  fontWeight: 900, 
                  fontSize: '13px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  backgroundColor: 'var(--bg-base-200)',
                  color: 'var(--text-base-content)',
                  opacity: 0.8,
                  py: 2.5
                }}>Email</TableCell>
                <TableCell sx={{ 
                  fontFamily: 'Outfit, sans-serif', 
                  fontWeight: 900, 
                  fontSize: '13px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  backgroundColor: 'var(--bg-base-200)',
                  color: 'var(--text-base-content)',
                  opacity: 0.8,
                  py: 2.5
                }}>Created Time</TableCell>
                <TableCell sx={{ 
                  fontFamily: 'Outfit, sans-serif', 
                  fontWeight: 900, 
                  fontSize: '13px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  backgroundColor: 'var(--bg-base-200)',
                  color: 'var(--text-base-content)',
                  opacity: 0.8,
                  py: 2.5
                }}>Status</TableCell>
                <TableCell align="center" sx={{ 
                  fontFamily: 'Outfit, sans-serif', 
                  fontWeight: 900, 
                  fontSize: '13px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px',
                  backgroundColor: 'var(--bg-base-200)',
                  color: 'var(--text-base-content)',
                  opacity: 0.8,
                  py: 2.5
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  sx={{ 
                    '&:hover': { backgroundColor: 'rgba(255, 125, 68, 0.03)' },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px', py: 2.5 }}>{user.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '14px', py: 2.5, opacity: 0.8 }}>{user.email}</TableCell>
                  <TableCell sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '14px', py: 2.5, opacity: 0.8 }}>{user.createdTime}</TableCell>
                  <TableCell sx={{ py: 2.5 }}>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                      user.status === 'active' 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-error/10 text-error border border-error/20'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2.5 }}>
                    <IconButton color="warning" onClick={()=>{handleDrawerOpen(user);console.log("here")}}>
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