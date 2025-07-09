import React from 'react';
import './AdminStatsCards.css';

const Card = ({ title, value, icon }) => {
  return (
    <div className="admin-card">
      <div className="admin-card-icon">{icon}</div>
      <div>
        <div className="admin-card-title">{title}</div>
        <div className="admin-card-value">{value}</div>
      </div>
    </div>
  );
};

const AdminStatsCards = ({ stats }) => {
  return (
    <div className="admin-card-container">
      <Card title="Total Users" value={stats.users} icon="👥" />
      <Card title="Total Entries" value={stats.entries} icon="📦" />
      <Card title="Total Paid" value={`₹${stats.paid}`} icon="✅" />
      <Card title="Total Due" value={`₹${stats.due}`} icon="❗" />
    </div>
  );
};

export default AdminStatsCards;
