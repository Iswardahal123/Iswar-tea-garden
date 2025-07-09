import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalWeight: 0,
    totalAmount: 0,
    totalDue: 0,
  });

  
  useEffect(() => {
    const fetchStats = async () => {
      const snapshot = await getDocs(collection(db, "entries"));
      let totalEntries = snapshot.size;
      let totalWeight = 0;
      let totalAmount = 0;
      let totalDue = 0;

      snapshot.forEach((doc) => {
        const d = doc.data();
        totalWeight += d.weight || 0;
        totalAmount += d.total || 0;
        totalDue += d.due || 0;
      });

      setStats({ totalEntries, totalWeight, totalAmount, totalDue });
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        📊 Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {[
          { label: "Total Entries", value: stats.totalEntries },
          { label: "Total Weight (kg)", value: stats.totalWeight },
          { label: "Total Amount", value: `₹${stats.totalAmount}` },
          { label: "Total Due", value: `₹${stats.totalDue}` },
        ].map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                {card.label}
              </Typography>
              <Typography variant="h6">{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
