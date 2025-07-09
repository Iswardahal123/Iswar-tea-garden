import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// ✅ Components
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

// ✅ Pages
import EntryFormPage from "./pages/EntryFormPage";
import EntryViewPage from "./pages/EntryViewPage";
import AdminPanel from "./pages/AdminPanel"; // ✅ Admin panel component

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

  const isAdmin = user.email === "admin@example.com"; // 🔒 Change email as needed

  return (
    <Router>
      <div style={{ paddingBottom: "56px" }}>
        <TopBar user={user} />

        <Routes>
          <Route path="/entry" element={<EntryFormPage />} />
          <Route path="/view" element={<EntryViewPage />} />
          {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
          <Route path="*" element={<Navigate to="/entry" />} />
        </Routes>

        {!isAdmin && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;
