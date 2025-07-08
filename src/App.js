import React, { useEffect, useState } from "react";
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
    <div>
      <h1>Ishwar Tea Garden</h1>
      <button onClick={handleLogout} style={{ float: "right" }}>
        Logout
      </button>
      <EntryForm />
      <EntryTable />
    </div>
  );
}

export default App;
