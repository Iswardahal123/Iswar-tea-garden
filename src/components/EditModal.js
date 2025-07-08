import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import EditModal from "./EditModal";

function EntryTable() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "entries"), // ✅ Correct Firestore collection
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
  };

  const handleSave = async (updatedData) => {
    if (!updatedData || !updatedData.id) return;

    try {
      const entryRef = doc(db, "entries", updatedData.id); // ✅ Update in same collection
      await updateDoc(entryRef, updatedData);
      setSelectedEntry(null);
      fetchEntries();
    } catch (err) {
      console.error("❌ Error saving entry:", err);
    }
  };

  return (
    <div style={{ marginTop: "30px", padding: "10px" }}>
      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            minWidth: "700px",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
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

                {selectedEntry?.id === entry.id && (
                  <tr style={{ backgroundColor: "#fdf6e3" }}>
                    <td colSpan="4">
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "12px",
                          fontSize: "13px",
                        }}
                      >
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
      </div>

      <EditModal
        entry={selectedEntry}
        onSave={handleSave}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}

export default EntryTable;
