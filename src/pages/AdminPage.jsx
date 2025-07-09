import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminStatsCards from '../components/AdminStatsCards';
import AdminEntryTable from '../components/AdminEntryTable';
import './AdminPage.css';

function AdminPage() {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-main">
        <AdminStatsCards />
        <AdminEntryTable />
      </div>
    </div>
  );
}

export default AdminPage;
