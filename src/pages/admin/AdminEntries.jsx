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
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const AdminEntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [userUIDs, setUserUIDs] = useState(new Set());

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Step 1: Get all user UIDs from 'users' collection
        const usersSnapshot = await getDocs(collection(db, "users"));
        const uids = new Set(usersSnapshot.docs.map((doc) => doc.id));
        setUserUIDs(uids);

        // Step 2: Fetch all entries from 'entries' collection
        const entriesSnapshot = await getDocs(collection(db, "entries"));
        const filteredEntries = entriesSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((entry) => uids.has(entry.uid)); // Filter only registered users' entries

        setEntries(filteredEntries);
      } catch (error) {
        console.error("❌ Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        📋 Entries by Registered Users
      </Typography>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User UID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.uid}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.weight}</TableCell>
                <TableCell>₹{entry.total}</TableCell>
                <TableCell>₹{entry.due}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminEntriesPage;
