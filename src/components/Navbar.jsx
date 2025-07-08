import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Ishwar Tea Garden
        </Typography>
        <div>
          <Button color="inherit" component={Link} to="/entry">
            ➕ Add Entry
          </Button>
          <Button color="inherit" component={Link} to="/view">
            📋 View Entries
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            🚪 Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
