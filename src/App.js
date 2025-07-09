import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// âœ… Components
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav"; // âœ… Corrected import

// âœ… Pages
import EntryFormPage from "./pages/EntryFormPage";
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
        {/* ðŸ”¼ Top Bar */}
        <TopBar user={user} />

        {/* ðŸ” Pages */}
        <Routes>
          <Route path="/entry" element={<EntryFormPage />} />
          <Route path="/view" element={<EntryViewPage />} />
          <Route path="*" element={<Navigate to="/entry" />} />
        </Routes>

        {/* ðŸ”½ Bottom Nav */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
