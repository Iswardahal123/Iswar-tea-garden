import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ✅ Pages & Components
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import EntryFormPage from "./pages/EntryFormPage";
import EntryViewPage from "./pages/EntryViewPage";
import AdminLayout from "./pages/admin/AdminLayout";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const roleDoc = await getDoc(doc(db, "roles", currentUser.uid));
          const isAdmin = roleDoc.exists() && roleDoc.data().isAdmin;

          if (isAdmin) {
            navigate("/admin");
          } else {
            navigate("/entry");
          }
        } catch (err) {
          console.error("Error checking role:", err.message);
        } finally {
          setCheckingRole(false);
        }
      } else {
        setCheckingRole(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checkingRole) return <p>🔄 Checking role...</p>;
  if (!user) return <Login onLogin={() => {}} />;

  return (
    <>
      <TopBar user={user} />
      <Routes>
        <Route path="/entry" element={<EntryFormPage />} />
        <Route path="/view" element={<EntryViewPage />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/entry" />} />
      </Routes>
      <BottomNav />
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
