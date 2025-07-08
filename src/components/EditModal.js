import React, { useEffect, useState } from "react";
import "./EditModal.css";

function EditModal({ entry, onSave, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (entry) setFormData(entry);
  }, [entry]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
                <input
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                />
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
