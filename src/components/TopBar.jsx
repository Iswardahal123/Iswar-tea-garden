import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Divider,
  Box, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Button, TextField
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  collection, query, where, getDocs, deleteDoc, doc,
  onSnapshot, addDoc, updateDoc, Timestamp
} from "firebase/firestore";

function TopBar({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAdvanceDialog, setOpenAdvanceDialog] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [summary, setSummary] = useState({
    advanceTaken: 0,
    totalWeight: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalAdvanceCut: 0,
    totalDue: 0,
  });

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    signOut(auth);
    handleClose();
  };
  const handleCopy = () => navigator.clipboard.writeText(user?.uid || "");

  const handleDeleteAllData = async () => {
    const q = query(collection(db, "entries"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map((d) => deleteDoc(doc(db, "entries", d.id)));
    await Promise.all(deletePromises);
    setOpenDeleteDialog(false);
    setAnchorEl(null);
  };

  const handleAdvanceSubmit = async () => {
    if (!advanceAmount) return;
    const q = query(
      collection(db, "advanceTaken"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await addDoc(collection(db, "advanceTaken"), {
        userId: user.uid,
        advanceTaken: parseFloat(advanceAmount),
        createdAt: Timestamp.now(),
      });
    } else {
      const docId = snapshot.docs[0].id;
      await updateDoc(doc(db, "advanceTaken", docId), {
        advanceTaken: parseFloat(advanceAmount),
        createdAt: Timestamp.now(),
      });
    }
    setOpenAdvanceDialog(false);
    setAdvanceAmount("");
  };

  useEffect(() => {
    if (!user) return;

    // Advance Taken
    (async () => {
      const q = query(collection(db, "advanceTaken"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      let advanceTaken = 0;
      if (!snapshot.empty) {
        advanceTaken = parseFloat(snapshot.docs[0].data().advanceTaken || 0);
      }

      setSummary((prev) => ({ ...prev, advanceTaken }));
    })();

    // Tea Entries
    const q = query(collection(db, "entries"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalWeight = 0,
        totalAmount = 0,
        totalPaid = 0,
        totalAdvanceCut = 0,
        totalDue = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalWeight += parseFloat(data.weight || 0);
        totalAmount += parseFloat(data.total || 0);
        totalPaid += parseFloat(data.paidAmount || 0);
        totalAdvanceCut += parseFloat(data.advanceCut || 0);
        totalDue += parseFloat(data.due || 0);
      });

      setSummary((prev) => ({
        ...prev,
        totalWeight,
        totalAmount,
        totalPaid,
        totalAdvanceCut,
        totalDue
      }));
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Ishwar Tea Garden</Typography>
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
                🧾 <strong style={{ marginLeft: 8 }}>Advance Taken:</strong> ₹{summary.advanceTaken}
              </MenuItem>
              <MenuItem disabled>
                🧺 <strong style={{ marginLeft: 8 }}>Total Tea Weight:</strong> {summary.totalWeight} kg
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

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={() => setOpenAdvanceDialog(true)}>
                ➕ Add / Update Advance Taken
              </MenuItem>
              <MenuItem onClick={() => setOpenDeleteDialog(true)}>
                🗑️ Delete All My Entry Data
              </MenuItem>
              <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* ✅ Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete All Entry Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all your tea entry records?
            <br />
            <strong>This action cannot be undone.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteAllData} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Advance Dialog */}
      <Dialog open={openAdvanceDialog} onClose={() => setOpenAdvanceDialog(false)}>
        <DialogTitle>Advance Taken</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter new advance taken amount:</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            type="number"
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdvanceDialog(false)}>Cancel</Button>
          <Button onClick={handleAdvanceSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TopBar;
