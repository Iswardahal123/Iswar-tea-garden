import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import EntryForm from "./components/EntryForm";
import EntryTable from "./components/EntryTable";
import Login from "./components/Login";
import { auth } from "./firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/entry"); // ✅ Redirect to entry page after login
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <Login onLogin={() => navigate("/entry")} />;
  }

  return (
    <div style={{ padding: "20px" }}>
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
  );
}

// ✅ Wrap AppWrapper in Router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
