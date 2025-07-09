import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// ✅ Components
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import AdminSidebar from "./components/AdminSidebar";

// ✅ Pages
import EntryFormPage from "./pages/EntryFormPage";
import EntryViewPage from "./pages/EntryViewPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEntries from "./pages/admin/AdminEntries";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  const isAdmin = user?.email === "admin@example.com"; // ✅ Change this to real admin check

  return (
    <Router>
      <div style={{ paddingBottom: isAdmin ? 0 : "56px", display: "flex" }}>
        {isAdmin && <AdminSidebar />}
        <div style={{ flex: 1 }}>
          {!isAdmin && <TopBar user={user} />}
          <Routes>
            {isAdmin ? (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/entries" element={<AdminEntries />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="*" element={<Navigate to="/admin" />} />
              </>
            ) : (
              <>
                <Route path="/entry" element={<EntryFormPage />} />
                <Route path="/view" element={<EntryViewPage />} />
                <Route path="*" element={<Navigate to="/entry" />} />
              </>
            )}
          </Routes>
          {!isAdmin && <BottomNav />}
        </div>
      </div>
    </Router>
  );
}

export default App;
