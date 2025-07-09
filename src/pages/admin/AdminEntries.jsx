import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography
} from "@mui/material";

const AdminEntries = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const q = query(collection(db, "entries"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
    };
    fetchEntries();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        📒 All User Entries
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Advance</TableCell>
              <TableCell>Due</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.userId?.slice(0, 6)}...</TableCell>
                <TableCell>{entry.weight}</TableCell>
                <TableCell>{entry.rate}</TableCell>
                <TableCell>{entry.total}</TableCell>
                <TableCell>{entry.paidAmount}</TableCell>
                <TableCell>{entry.advanceCut}</TableCell>
                <TableCell>{entry.due}</TableCell>
                <TableCell style={{ color: entry.paidStatus === "paid" ? "green" : "red" }}>
                  {entry.paidStatus}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminEntries;
