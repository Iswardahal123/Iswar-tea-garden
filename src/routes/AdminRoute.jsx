import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

// 🔐 Your predefined admin UID (replace with your actual admin UID)
const ADMIN_UID = 'your_admin_uid_here';

const AdminRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) return <Navigate to="/" />;
  if (user.uid !== ADMIN_UID) return <Navigate to="/unauthorized" />;

  return children;
};

export default AdminRoute;
