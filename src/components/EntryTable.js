import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

function EntryTable() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const snapshot = await getDocs(collection(db, "entries"));
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEntries();
  }, []);

  return (
    <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight (kg)</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id}>
            <td>{entry.date}</td>
            <td>{entry.weight}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EntryTable;
