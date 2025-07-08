import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

function TopBar({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summary, setSummary] = useState({
    totalWeight: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalAdvanceCut: 0,
    totalDue: 0,
  });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut(auth);
    handleClose();
  };

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user) return;
      const q = query(
        collection(db, "entries"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      let totalWeight = 0;
      let totalAmount = 0;
      let totalPaid = 0;
      let totalAdvanceCut = 0;
      let totalDue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalWeight += data.weight || 0;
        totalAmount += data.total || 0;
        totalPaid += data.paidAmount || 0;
        totalAdvanceCut += data.advanceCut || 0;
        totalDue += data.due || 0;
      });

      setSummary({
        totalWeight,
        totalAmount,
        totalPaid,
        totalAdvanceCut,
        totalDue,
      });
    };

    fetchSummary();
  }, [user]);

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Ishwar Tea Garden
        </Typography>
        <div>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenu}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{ minWidth: "280px" }}
          >
            <MenuItem disabled>
              UID: {user?.uid.slice(0, 8)}...
            </MenuItem>
            <Divider />
            <MenuItem disabled>🧺 Total Pattas: {summary.totalWeight} kg</MenuItem>
            <MenuItem disabled>💰 Total Amount: ₹{summary.totalAmount}</MenuItem>
            <MenuItem disabled>✅ Paid: ₹{summary.totalPaid}</MenuItem>
            <MenuItem disabled>🧾 Advance Cut: ₹{summary.totalAdvanceCut}</MenuItem>
            <MenuItem disabled>❗ Due: ₹{summary.totalDue}</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
