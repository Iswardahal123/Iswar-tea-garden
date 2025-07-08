// File: src/components/EditModal.jsx

import React, { useEffect, useState } from "react";
import "./EditModal.css";

function EditModal({ entry, onSave, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (entry) setFormData(entry);
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // 🧮 Auto calculate total
      const weightNum = parseFloat(updated.weight) || 0;
      const rateNum = parseFloat(updated.rate) || 0;
      updated.total = weightNum * rateNum;

      // 💰 Auto calculate due
      const paid = parseFloat(updated.paidAmount) || 0;
      const cut = parseFloat(updated.advanceCut) || 0;
      updated.due = updated.total - paid - cut;

      return updated;
    });
  };

  const handleSubmit = () => {
    if (!formData || !formData.id) return;
    onSave(formData);
  };

  if (!entry) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">Edit Entry</div>

        <div className="modal-body">
          <div className="modal-fields">
            {["date", "day", "weight", "rate", "total", "paidAmount", "advanceCut", "due", "paidStatus"].map((field) => (
              <label key={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
                {field === "paidStatus" ? (
                  <select
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                ) : (
                  <input
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    disabled={field === "total" || field === "due"} // readonly for calculated fields
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="save-btn" onClick={handleSubmit}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
