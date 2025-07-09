import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Box, Typography, Paper, Button } from "@mui/material";

const AdminUsersPage = () => {
  const [userUIDs, setUserUIDs] = useState([]);
  const [disabledUsers, setDisabledUsers] = useState({});

  useEffect(() => {
    const fetchUIDs = async () => {
      const entrySnapshot = await getDocs(collection(db, "entries"));
      const uidSet = new Set();

      entrySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.uid) {
          uidSet.add(data.uid);
        }
      });

      setUserUIDs([...uidSet]);
    };

    fetchUIDs();
  }, []);

  const handleToggleDisable = (uid) => {
    setDisabledUsers((prev) => ({
      ...prev,
      [uid]: !prev[uid],
    }));
  };

  const handleEditUser = (uid) => {
    alert(`🛠 Edit user ${uid} clicked`);
    // Future enhancement: Open modal to edit user info
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        👥 Registered Users (From Entries)
      </Typography>

      {userUIDs.length === 0 ? (
        <Typography>No user data found in entries.</Typography>
      ) : (
        userUIDs.map((uid) => (
          <Paper key={uid} sx={{ p: 2, mb: 2 }}>
            <Typography><strong>UID:</strong> {uid}</Typography>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleEditUser(uid)}
              >
                ✏️ Edit
              </Button>

              <Button
                variant="contained"
                color={disabledUsers[uid] ? "success" : "error"}
                onClick={() => handleToggleDisable(uid)}
              >
                {disabledUsers[uid] ? "Enable" : "Disable"}
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminUsersPage;
