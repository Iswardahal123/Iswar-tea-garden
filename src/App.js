import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import EntryForm from "./components/EntryForm";
import EntryTable from "./components/EntryTable";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

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
      <div>
        <h1>Ishwar Tea Garden</h1>
        <button onClick={handleLogout} style={{ float: "right" }}>
          Logout
        </button>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/entry">➕ Add Entry</Link> |{" "}
          <Link to="/view">📋 View Entries</Link>
        </nav>

        <Routes>
          <Route path="/entry" element={<EntryForm />} />
          <Route path="/view" element={<EntryTable />} />
          <Route path="*" element={<Navigate to="/entry" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
