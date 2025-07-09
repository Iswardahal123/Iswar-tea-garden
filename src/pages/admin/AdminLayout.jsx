import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: "24px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
