import React, { useEffect, useState } from "react"; import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Divider, Box, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from "@mui/material"; import AccountCircle from "@mui/icons-material/AccountCircle"; import ContentCopyIcon from '@mui/icons-material/ContentCopy'; import { signOut } from "firebase/auth"; import { auth, db } from "../firebase/config"; import { collection, onSnapshot, query, where, getDocs, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

function TopBar({ user }) { const [anchorEl, setAnchorEl] = useState(null); const [openDialog, setOpenDialog] = useState(false); const [openAdvanceDialog, setOpenAdvanceDialog] = useState(false); const [advanceInput, setAdvanceInput] = useState(""); const [summary, setSummary] = useState({ totalWeight: 0, totalAmount: 0, totalPaid: 0, totalAdvanceCut: 0, totalDue: 0, advanceTaken: 0, });

const handleMenu = (event) => { setAnchorEl(event.currentTarget); };

const handleClose = () => { setAnchorEl(null); };

const handleLogout = () => { signOut(auth); handleClose(); };

const handleCopy = () => { navigator.clipboard.writeText(user?.uid || ""); };

const handleDeleteAllData = async () => { try { const q = query(collection(db, "entries"), where("userId", "==", user.uid)); const snapshot = await getDocs(q); const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, "entries", docSnap.id)) ); await Promise.all(deletePromises); setOpenDialog(false); setAnchorEl(null); } catch (err) { console.error("❌ Delete failed:", err.message); setOpenDialog(false); } };

const handleAdvanceSubmit = async () => { try { const q = query(collection(db, "advanceTaken"), where("userId", "==", user.uid)); const snapshot = await getDocs(q); if (!snapshot.empty) { const docRef = snapshot.docs[0].ref; await setDoc(docRef, { userId: user.uid, advanceTaken: parseFloat(advanceInput) }, { merge: true }); } else { const newRef = doc(collection(db, "advanceTaken")); await setDoc(newRef, { userId: user.uid, advanceTaken: parseFloat(advanceInput) }); } setOpenAdvanceDialog(false); setAdvanceInput(""); } catch (err) { console.error("❌ Advance update failed:", err.message); setOpenAdvanceDialog(false); } };

useEffect(() => { if (!user) return;

const q1 = query(collection(db, "entries"), where("userId", "==", user.uid));
const unsubscribe1 = onSnapshot(q1, (snapshot) => {
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

const q2 = query(collection(db, "advanceTaken"), where("userId", "==", user.uid));
const unsubscribe2 = onSnapshot(q2, (snapshot) => {
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    setSummary((prev) => ({
      ...prev,
      advanceTaken: parseFloat(data.advanceTaken || 0)
    }));
  }
});

return () => {
  unsubscribe1();
  unsubscribe2();
};

}, [user]);

return ( <> <AppBar position="static" color="primary"> <Toolbar sx={{ justifyContent: "space-between" }}> <Typography variant="h6" component="div"> Ishwar Tea Garden </Typography> <div> <IconButton size="large" edge="end" color="inherit" onClick={handleMenu}> <AccountCircle /> </IconButton>

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

            <MenuItem disabled>
            🪙 <strong style={{ marginLeft: 8 }}>Advance Taken:</strong> ₹{summary.advanceTaken}
          </MenuItem>
            🧺 <strong style={{ marginLeft: 8 }}>Total Tea weight:</strong> {summary.totalWeight} kg
          </MenuItem>
          <MenuItem disabled>
            💰 <strong style={{ marginLeft: 8 }}>Total Amount:</strong> ₹{summary.totalAmount}
          </MenuItem>
          <MenuItem disabled>
            ✅ <strong style={{ marginLeft: 8 }}>Received amount:</strong> ₹{summary.totalPaid}
          </MenuItem>
          <MenuItem disabled>
            🧾 <strong style={{ marginLeft: 8 }}>Advance Cut:</strong> ₹{summary.totalAdvanceCut}
          </MenuItem>
          <MenuItem disabled>
            ❗ <strong style={{ marginLeft: 8 }}>Balance amount:</strong> ₹{summary.totalDue}
          </MenuItem>
          

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={() => setOpenAdvanceDialog(true)}>➕ Add/Update Advance Taken</MenuItem>
          <MenuItem onClick={() => setOpenDialog(true)}>🗑️ Delete All My Entry Data</MenuItem>
          <MenuItem onClick={handleLogout}>🚪 Logout</MenuItem>
        </Menu>
      </div>
    </Toolbar>
  </AppBar>

  {/* 🔐 Delete Confirmation Dialog */}
  <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
    <DialogTitle>Delete All Entry Data?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete all your tea entry records?
        <br />
        <strong>This action cannot be undone.</strong>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenDialog(false)} color="inherit">
        Cancel
      </Button>
      <Button onClick={handleDeleteAllData} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>

  {/* ➕ Add Advance Dialog */}
  <Dialog open={openAdvanceDialog} onClose={() => setOpenAdvanceDialog(false)}>
    <DialogTitle>Set Advance Taken</DialogTitle>
    <DialogContent>
      <TextField
        type="number"
        fullWidth
        label="Enter advance amount"
        value={advanceInput}
        onChange={(e) => setAdvanceInput(e.target.value)}
        margin="normal"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenAdvanceDialog(false)}>Cancel</Button>
      <Button onClick={handleAdvanceSubmit} variant="contained" color="primary">
        Submit
      </Button>
    </DialogActions>
  </Dialog>
</>

); }

export default TopBar;

