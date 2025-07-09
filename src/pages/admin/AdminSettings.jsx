import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const AdminSettings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        ⚙️ Admin Settings
      </Typography>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="body1">
          This section can be used to configure:
        </Typography>
        <ul>
          <li>🌿 Site name / Branding</li>
          <li>💸 Default tea leaf rate per kg</li>
          <li>🔐 User access or roles</li>
          <li>📅 Closing reports / backups</li>
        </ul>
        <Typography variant="body2" sx={{ mt: 2 }}>
          (Settings logic is not implemented yet. You can add Firestore doc to store global settings.)
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
