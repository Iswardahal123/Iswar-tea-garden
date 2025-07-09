import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';

// 🔐 Your predefined admin UID (replace with your actual admin UID)
const ADMIN_UID = '5w2gQQmXQHWt6eonuKj6Kd2ufne2';

const AdminRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) return <Navigate to="/" />;
  if (user.uid !== ADMIN_UID) return <Navigate to="/unauthorized" />;

  return children;
};

export default AdminRoute;
