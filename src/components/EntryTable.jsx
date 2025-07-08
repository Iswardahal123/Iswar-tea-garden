import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/config"; // ✅ auth import added
import EditModal from "./EditModal";

function EntryTable() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "entries"), // ✅ Make sure your Firestore collection name is correct
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
  };

  const handleSave = async (updatedData) => {
    if (!selectedEntry) return;
    const entryRef = doc(db, "pattaEntries", selectedEntry.id);
    await updateDoc(entryRef, updatedData);
    setSelectedEntry(null);
    fetchEntries();
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Weight</th>
            <th>Rate</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Advance Cut</th>
            <th>Due</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.day || "-"}</td>
              <td>{entry.weight}</td>
              <td>{entry.rate || "-"}</td>
              <td>{entry.total || "-"}</td>
              <td>{entry.paidAmount || "-"}</td>
              <td>{entry.advanceCut || "-"}</td>
              <td>{entry.due || "-"}</td>
              <td>{entry.paidStatus || "-"}</td>
              <td>
                <button onClick={() => handleEditClick(entry)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditModal
        entry={selectedEntry}
        onSave={handleSave}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}

export default EntryTable;
