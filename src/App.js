import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// ✅ Navbar + Pages
import Navbar from "./components/Navbar";
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
      <Navbar />
      <Routes>
        <Route path="/entry" element={<EntryFormPage />} />
        <Route path="/view" element={<EntryViewPage />} />
        <Route path="*" element={<Navigate to="/entry" />} />
      </Routes>
    </Router>
  );
}

export default App;
