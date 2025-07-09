import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";


// ✅ User Components
import Login from "./components/Login";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

// ✅ User Pages
import EntryFormPage from "./pages/EntryFormPage";
import EntryViewPage from "./pages/EntryViewPage";

// ✅ Admin Layout & Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
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

  if (!user) return <Login onLogin={() => {}} />;

  const isAdmin = user.email === "admin@teagarden.com"; // 👈 customize admin email

  return (
    <Router>
      {isAdmin ? (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      ) : (
        <div style={{ paddingBottom: "56px" }}>
          <TopBar user={user} />
          <Routes>
            <Route path="/entry" element={<EntryFormPage />} />
            <Route path="/view" element={<EntryViewPage />} />
            <Route path="*" element={<Navigate to="/entry" />} />
          </Routes>
          <BottomNav />
        </div>
      )}
    </Router>
  );
}

export default App;
