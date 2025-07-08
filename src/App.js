import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

// ✅ Pages
import EntryFormPage from "./pages/EntryFormPage";
import EntryViewPage from "./pages/EntryViewPage";
import BottomNav from "./components/BottomNav";

function App() {
  const [user, setUser] = useState(null);
  const [navValue, setNavValue] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <Router>
      <div style={{ paddingBottom: "70px" }}>
        <h1>Ishwar Tea Garden</h1>
        <button onClick={handleLogout} style={{ float: "right" }}>
          Logout
        </button>

        <Routes>
          <Route path="/entry" element={<EntryFormPage />} />
          <Route path="/view" element={<EntryViewPage />} />
          <Route path="*" element={<Navigate to="/entry" />} />
        </Routes>

        <BottomNav value={navValue} setValue={setNavValue} />
      </div>
    </Router>
  );
}

export default App;
