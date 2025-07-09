import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { Box, Tooltip, Button } from "@mui/material";

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

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.uid || "");
  };

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "entries"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalWeight = 0;
      let totalAmount = 0;
      let totalPaid = 0;
      let totalAdvanceCut = 0;
      let totalDue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalWeight += parseFloat(data.weight || 0);
        totalAmount += parseFloat(data.total || 0);
        totalPaid += parseFloat(data.paidAmount || 0);
        totalAdvanceCut += parseFloat(data.advanceCut || 0);
        totalDue += parseFloat(data.due || 0);
      });

      setSummary({
        totalWeight,
        totalAmount,
        totalPaid,
        totalAdvanceCut,
        totalDue,
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleReceivePayment = async () => {
    if (summary.totalDue <= 0) {
      alert("🎉 No pending due to pay!");
      return;
    }

    const amount = summary.totalDue * 100; // Convert to paisa

    const options = {
      key: "rzp_test_AvXRP4rfovLSun", // 🔴 Replace with your Razorpay Test Key
      amount,
      currency: "INR",
      name: "Ishwar Tea Garden",
      description: "Tea Due Payment",
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response) {
        try {
          // Subtract from all entries
          const q = query(collection(db, "entries"), where("userId", "==", user.uid));
          const snapshot = await onSnapshot(q, async (snap) => {
            snap.forEach(async (entryDoc) => {
              const ref = doc(db, "entries", entryDoc.id);
              const entry = entryDoc.data();
              const newDue = Math.max((entry.due || 0) - summary.totalDue, 0);
              const newPaid = (entry.paidAmount || 0) + summary.totalDue;

              await updateDoc(ref, {
                due: newDue,
                paidAmount: newPaid,
              });
            });
          });

          alert("✅ Payment successful and due updated.");
        } catch (err) {
          alert("❌ Failed to update after payment: " + err.message);
        }
      },
      prefill: {
        email: user.email,
      },
      theme: {
        color: "#1b5e20",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Ishwar Tea Garden
        </Typography>

        <div>
          <IconButton size="large" edge="end" color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{ sx: { minWidth: "300px", p: 1 } }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1}>
              <Typography fontSize="14px" fontWeight="bold">
                UID: {user?.uid?.slice(0, 8)}...
              </Typography>
              <Tooltip title="Tap to Copy">
                <IconButton size="small" onClick={handleCopy}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Divider sx={{ my: 1 }} />

            <MenuItem disabled>
              🧺 <strong style={{ marginLeft: 8 }}>Total Tea weight:</strong> {summary.totalWeight} kg
            </MenuItem>
            <MenuItem disabled>
              💰 <strong style={{ marginLeft: 8 }}>Total Amount:</strong> ₹{summary.totalAmount}
            </MenuItem>
            <MenuItem disabled>
              ✅ <strong style={{ marginLeft: 8 }}>Received:</strong> ₹{summary.totalPaid}
            </MenuItem>
            <MenuItem disabled>
              🧾 <strong style={{ marginLeft: 8 }}>Advance Cut:</strong> ₹{summary.totalAdvanceCut}
            </MenuItem>
            <MenuItem disabled>
              ❗ <strong style={{ marginLeft: 8 }}>Balance:</strong> ₹{summary.totalDue}
            </MenuItem>

            <Box px={2} py={1}>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                onClick={handleReceivePayment}
              >
                📥 Receive Payment
              </Button>
            </Box>

            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
