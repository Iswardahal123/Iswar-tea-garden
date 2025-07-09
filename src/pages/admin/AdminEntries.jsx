// 📁 src/pages/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Switch,
} from "@mui/material";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "users", id), { enabled: !currentStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, enabled: !currentStatus } : u
        )
      );
    } catch (err) {
      console.error("Status toggle error:", err.message);
    }
  };

  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, "users"), {
        email: newEmail,
        password: newPassword,
        enabled: true,
      });
      setAddOpen(false);
      setNewEmail("");
      setNewPassword("");
      window.location.reload(); // Refresh to fetch updated users
    } catch (err) {
      console.error("Error adding user:", err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👤 Manage Users
      </Typography>

      <Button
        startIcon={<PersonAddIcon />}
        variant="contained"
        onClick={() => setAddOpen(true)}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>UID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.enabled}
                      onChange={() =>
                        handleToggleStatus(user.id, user.enabled)
                      }
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    {/* Future: Edit Password dialog can be triggered here */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ➕ Add User Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>➕ Add New User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;
