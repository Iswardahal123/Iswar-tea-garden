import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "All Entries", path: "/admin/entries" },
    { label: "Users", path: "/admin/users" },
    { label: "Settings", path: "/admin/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1b1b1b",
          color: "#fff",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" noWrap>
          🛠 Admin Panel
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: isActive ? "#333" : "transparent",
                  "&:hover": {
                    backgroundColor: "#2c2c2c",
                  },
                  cursor: "pointer",
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
