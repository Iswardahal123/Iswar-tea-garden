import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

const AdminUsers = () => {
  const [userSummaries, setUserSummaries] = useState([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      const q = query(collection(db, "entries"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const allEntries = snapshot.docs.map((doc) => doc.data());

      const summaryMap = {};

      allEntries.forEach((entry) => {
        const uid = entry.userId || "unknown";
        if (!summaryMap[uid]) {
          summaryMap[uid] = {
            userId: uid,
            totalWeight: 0,
            totalAmount: 0,
            totalPaid: 0,
            totalAdvanceCut: 0,
            totalDue: 0,
          };
        }
        summaryMap[uid].totalWeight += entry.weight || 0;
        summaryMap[uid].totalAmount += entry.total || 0;
        summaryMap[uid].totalPaid += entry.paidAmount || 0;
        summaryMap[uid].totalAdvanceCut += entry.advanceCut || 0;
        summaryMap[uid].totalDue += entry.due || 0;
      });

      setUserSummaries(Object.values(summaryMap));
    };

    fetchSummaries();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👥 User Summary Report
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Total Pattas (kg)</TableCell>
              <TableCell>Total Amount (₹)</TableCell>
              <TableCell>Paid (₹)</TableCell>
              <TableCell>Advance Cut (₹)</TableCell>
              <TableCell>Due (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSummaries.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId.slice(0, 8)}...</TableCell>
                <TableCell>{user.totalWeight.toFixed(2)}</TableCell>
                <TableCell>{user.totalAmount.toFixed(2)}</TableCell>
                <TableCell>{user.totalPaid.toFixed(2)}</TableCell>
                <TableCell>{user.totalAdvanceCut.toFixed(2)}</TableCell>
                <TableCell>{user.totalDue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminUsers;
