import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const snapshot = await getDocs(collection(db, "entries"));
      const userMap = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const uid = data.uid;
        const email = data.email;

        if (uid) {
          if (!userMap[uid]) {
            userMap[uid] = {
              uid,
              email,
              count: 1,
            };
          } else {
            userMap[uid].count += 1;
          }
        }
      });

      const uniqueUsers = Object.values(userMap);
      setUsers(uniqueUsers);
    };

    fetchUserData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👥 Registered Users
      </Typography>

      <Paper sx={{ mt: 2, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>UID</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Total Entries</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.uid}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.count}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="primary" sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button size="small" variant="outlined" color="error">
                    Disable
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminUsersPage;
