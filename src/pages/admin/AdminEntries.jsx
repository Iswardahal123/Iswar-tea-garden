import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersFromEntries = async () => {
      const entriesSnapshot = await getDocs(collection(db, "entries"));

      const userMap = new Map();

      entriesSnapshot.forEach((doc) => {
        const data = doc.data();
        const uid = data.uid;
        const email = data.email;

        if (uid && email) {
          if (!userMap.has(uid)) {
            userMap.set(uid, { uid, email, totalEntries: 1 });
          } else {
            const existing = userMap.get(uid);
            userMap.set(uid, {
              ...existing,
              totalEntries: existing.totalEntries + 1,
            });
          }
        }
      });

      setUsers(Array.from(userMap.values()));
    };

    fetchUsersFromEntries();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👥 Users (Fetched from Entries)
      </Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Total Entries</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.uid}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.totalEntries}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <BlockIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminUsersPage;
