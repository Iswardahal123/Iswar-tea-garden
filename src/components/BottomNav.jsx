import React, { useState, useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListAltIcon from '@mui/icons-material/ListAlt';
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
        zIndex: 1000,
        borderTop: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      <BottomNavigationAction label="Add Entry" icon={<AddCircleOutlineIcon />} />
      <BottomNavigationAction label="View Entries" icon={<ListAltIcon />} />
    </BottomNavigation>
  );
};

export default BottomNav;
