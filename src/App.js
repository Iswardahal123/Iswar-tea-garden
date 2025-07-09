// src/App.js
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
  const navigate = useNavigate();

  const onLogin = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const roleDoc = await getDoc(doc(db, "roles", user.uid));
    console.log("🔥 Role fetched:", roleDoc.exists(), roleDoc.data());

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

  if (!user) {
    return <Login onLogin={onLogin} />;
  }

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
