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
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const entriesSnapshot = await getDocs(collection(db, "entries"));

        // ✅ Step 1: Get all UIDs from entries
        const uidCountMap = new Map();
        entriesSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.uid) {
            uidCountMap.set(data.uid, (uidCountMap.get(data.uid) || 0) + 1);
          }
        });

        // ✅ Step 2: Get emails from users collection using UIDs
        const userList = [];
        for (let [uid, count] of uidCountMap.entries()) {
          const userDoc = await getDoc(doc(db, "users", uid));
          const email = userDoc.exists() ? userDoc.data().email : "N/A";
          userList.push({ uid, email, totalEntries: count });
        }

        setUsers(userList);
      } catch (error) {
        console.error("❌ Failed to fetch user list:", error);
      }
    };

    fetchUserList();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👥 Registered Users from Entries
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
