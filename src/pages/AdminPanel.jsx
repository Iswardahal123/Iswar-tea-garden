import React from "react";
import { Box } from "@mui/material";
import AdminSidebar from "../components/AdminSidebar";

const AdminPanel = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        <h2>📊 Admin Dashboard</h2>
        <p>Welcome, admin! Here's your control panel.</p>
        {/* Add more components or routes here */}
      </Box>
    </Box>
  );
};

export default AdminPanel;
