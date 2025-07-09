// ✅ App.js (Full Updated)
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Components
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

// User Pages
import EntryFormPage from "./pages/EntryFormPage";
import EntryViewPage from "./pages/EntryViewPage";

// Admin Pages & Layout
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminEntriesPage from "./pages/admin/AdminEntriesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const onLogin = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const roleDoc = await getDoc(doc(db, "roles", user.uid));
    const isAdmin = roleDoc.exists() && roleDoc.data().isAdmin;
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/entry");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isAdminPath = window.location.pathname.startsWith("/admin");

  if (!user) {
    return <Login onLogin={onLogin} />;
  }

  return (
    <>
      {!isAdminPath && <TopBar user={user} />}

      <Routes>
        {/* User Routes */}
        <Route path="/entry" element={<EntryFormPage />} />
        <Route path="/view" element={<EntryViewPage />} />

        {/* Admin Routes with nested children */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="entries" element={<AdminEntriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/entry" />} />
      </Routes>

      {!isAdminPath && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
