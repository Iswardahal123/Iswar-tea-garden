import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// ✅ Components
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";

// ✅ Pages
import EntryForm from "./pages/EntryFormPage";      // ✅ Corrected name here
import EntryViewPage from "./pages/EntryViewPage";

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

  return (
    <Router>
      <div style={{ paddingBottom: "56px" }}>
        {/* 🔼 Top Bar */}
        <TopBar user={user} />

        {/* 🔁 Pages */}
        <Routes>
          <Route path="/entry" element={<EntryForm />} />         {/* ✅ Fixed usage */}
          <Route path="/view" element={<EntryViewPage />} />
          <Route path="*" element={<Navigate to="/entry" />} />
        </Routes>

        {/* 🔽 Bottom Nav */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
