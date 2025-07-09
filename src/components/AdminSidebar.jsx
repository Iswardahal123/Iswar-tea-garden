import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const AdminSidebar = ({ onSelect }) => {
  return (
    <div className="admin-sidebar">
      <h2 className="sidebar-title">🛠️ Admin Panel</h2>
      <ul className="sidebar-menu">
        <li onClick={() => onSelect('dashboard')}>📊 Dashboard</li>
        <li onClick={() => onSelect('entries')}>📁 All Entries</li>
        <li onClick={() => signOut(auth)} className="logout">🚪 Logout</li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
