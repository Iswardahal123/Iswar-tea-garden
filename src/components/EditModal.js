import React, { useState, useEffect } from "react";

function EditModal({ entry, onSave, onClose }) {
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    weight: "",
    rate: "",
    paidAmount: "",
    advanceCut: "",
    paidStatus: "Pending",
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date || "",
        day: entry.day || "",
        weight: entry.weight || "",
        rate: entry.rate || "",
        paidAmount: entry.paidAmount || "",
        advanceCut: entry.advanceCut || "",
        paidStatus: entry.paidStatus || "Pending",
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const weight = parseFloat(formData.weight) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const paidAmount = parseFloat(formData.paidAmount) || 0;
    const advanceCut = parseFloat(formData.advanceCut) || 0;

    const total = weight * rate;
    const due = total - paidAmount - advanceCut;

    onSave({
      ...formData,
      weight,
      rate,
      paidAmount,
      advanceCut,
      total,
      due,
    });
  };

  if (!entry) return null;

  return (
    <div style={modalStyle}>
      <h3>Edit Entry</h3>
      <input type="date" name="date" value={formData.date} onChange={handleChange} />
      <input type="text" name="day" value={formData.day} onChange={handleChange} placeholder="Day" />
      <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" />
      <input type="number" name="rate" value={formData.rate} onChange={handleChange} placeholder="Rate" />
      <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleChange} placeholder="Paid Amount" />
      <select name="paidStatus" value={formData.paidStatus} onChange={handleChange}>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
      </select>
      <input type="number" name="advanceCut" value={formData.advanceCut} onChange={handleChange} placeholder="Advance Cut" />
      <br /><br />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose} style={{ marginLeft: "10px" }}>Cancel</button>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: "20%",
  left: "30%",
  width: "40%",
  backgroundColor: "white",
  border: "1px solid #ccc",
  padding: "20px",
  zIndex: 1000,
};

export default EditModal;
