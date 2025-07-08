// ✅ File: BottomNav.jsx

import React, { useState, useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (location.pathname === "/entry") setValue(0);
    else if (location.pathname === "/view") setValue(1);
    else setValue(-1);
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate("/entry");
    else if (newValue === 1) navigate("/view");
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      showLabels
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e0e0e0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <BottomNavigationAction
        label="Add Entry"
        icon={<AddCircleOutlineIcon />}
        sx={{
          color: value === 0 ? "#2e7d32" : "inherit",
          "&:hover": {
            color: "#2e7d32",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
          },
        }}
      />
      <BottomNavigationAction
        label="View Entries"
        icon={<ListAltIcon />}
        sx={{
          color: value === 1 ? "#1565c0" : "inherit",
          "&:hover": {
            color: "#1565c0",
            backgroundColor: "rgba(33, 150, 243, 0.1)",
          },
        }}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
