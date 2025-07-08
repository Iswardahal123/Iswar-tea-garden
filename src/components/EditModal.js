import React, { useState, useEffect } from "react";
import "./EditModal.css";

function EditModal({ entry, onSave, onClose }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (entry) setFormData(entry);
  }, [entry]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    if (!formData || !formData.id) return;
    onSave(formData); // passes updated formData back to parent
  };

  if (!entry) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Edit Entry</h2>
        <div className="modal-fields">
          <label>Date:
            <input name="date" value={formData.date || ""} onChange={handleChange} />
          </label>
          <label>Day:
            <input name="day" value={formData.day || ""} onChange={handleChange} />
          </label>
          <label>Weight:
            <input name="weight" value={formData.weight || ""} onChange={handleChange} />
          </label>
          <label>Rate:
            <input name="rate" value={formData.rate || ""} onChange={handleChange} />
          </label>
          <label>Total:
            <input name="total" value={formData.total || ""} onChange={handleChange} />
          </label>
          <label>Paid Amount:
            <input name="paidAmount" value={formData.paidAmount || ""} onChange={handleChange} />
          </label>
          <label>Advance Cut:
            <input name="advanceCut" value={formData.advanceCut || ""} onChange={handleChange} />
          </label>
          <label>Due:
            <input name="due" value={formData.due || ""} onChange={handleChange} />
          </label>
          <label>Status:
            <input name="paidStatus" value={formData.paidStatus || ""} onChange={handleChange} />
          </label>
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
