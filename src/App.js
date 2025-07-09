// App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import EntryFormPage from "./pages/EntryFormPage";
import EntryViewPage from "./pages/EntryViewPage";
import AdminLayout from "./pages/admin/AdminLayout";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // 🔍 Check admin role in Firestore
        const roleRef = doc(db, "roles", currentUser.uid);
        const roleSnap = await getDoc(roleRef);

        if (roleSnap.exists() && roleSnap.data().isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Login onLogin={() => {}} />;

  return (
    <Router>
      <div style={{ paddingBottom: "56px" }}>
        <TopBar user={user} />

        <Routes>
          {/* ✅ Admin Panel Route */}
          {isAdmin && <Route path="/admin/*" element={<AdminLayout />} />}

          {/* ✅ User Routes */}
          <Route path="/entry" element={<EntryFormPage />} />
          <Route path="/view" element={<EntryViewPage />} />
          <Route
            path="*"
            element={<Navigate to={isAdmin ? "/admin" : "/entry"} />}
          />
        </Routes>

        {!isAdmin && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;
