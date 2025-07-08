import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import EditModal from "./EditModal";

function EntryTable() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "entries"),
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
    <div style={{ marginTop: "30px", overflowX: "auto" }}>
      <table border="1" cellPadding="8" style={{ minWidth: "600px", width: "100%" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <React.Fragment key={entry.id}>
              <tr>
                <td>{entry.date}</td>
                <td>{entry.weight}</td>
                <td>{entry.paidStatus || "-"}</td>
                <td>
                  <button onClick={() => handleEditClick(entry)}>
                    {selectedEntry?.id === entry.id ? "Hide" : "Edit"}
                  </button>
                </td>
              </tr>

              {/* Expand row only if this entry is selected */}
              {selectedEntry?.id === entry.id && (
                <tr style={{ backgroundColor: "#fdf6e3" }}>
                  <td colSpan="4">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                      <div><strong>Day:</strong> {entry.day || "-"}</div>
                      <div><strong>Rate:</strong> {entry.rate || "-"}</div>
                      <div><strong>Total:</strong> {entry.total || "-"}</div>
                      <div><strong>Paid:</strong> {entry.paidAmount || "-"}</div>
                      <div><strong>Advance Cut:</strong> {entry.advanceCut || "-"}</div>
                      <div><strong>Due:</strong> {entry.due || "-"}</div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
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
