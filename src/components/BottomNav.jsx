import React, { useState, useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  // set selected tab based on current path
  useEffect(() => {
    if (location.pathname === "/entry") setValue(0);
    else if (location.pathname === "/view") setValue(1);
    else setValue(-1); // unknown route
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate("/entry");
    else if (newValue === 1) navigate("/view");
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} showLabels>
      <BottomNavigationAction label="Add Entry" icon={<RestoreIcon />} />
      <BottomNavigationAction label="View Entries" icon={<FavoriteIcon />} />
    </BottomNavigation>
  );
};

export default BottomNav;
