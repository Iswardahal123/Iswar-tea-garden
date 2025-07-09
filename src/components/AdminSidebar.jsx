import React from "react";
import { Drawer, List, ListItem, ListItemText, Toolbar, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminSidebar = () => {
  const navigate = useNavigate();

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
          color: "#fff"
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          🛠 Admin Panel
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.label} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
