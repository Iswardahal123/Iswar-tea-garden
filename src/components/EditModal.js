import React, { useState, useEffect } from "react";
import "./EditModal.css"; // We'll create this CSS file

function EditModal({ entry, onSave, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (entry) setFormData(entry);
  }, [entry]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData) return;
    onSave(formData);
  };

  if (!entry) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Edit Entry</h2>
        <div className="modal-fields">
          <label>
            Date:
            <input
              type="text"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Weight:
            <input
              type="text"
              name="weight"
              value={formData.weight || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Status:
            <input
              type="text"
              name="paidStatus"
              value={formData.paidStatus || ""}
              onChange={handleChange}
            />
          </label>
          {/* Add more fields as needed */}
        </div>
        <div className="modal-buttons">
          <button onClick={handleSubmit} className="save-btn">Save</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
