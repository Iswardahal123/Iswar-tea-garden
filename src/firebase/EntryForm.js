import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function EntryForm() {
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !weight) return alert("All fields are required!");

    await addDoc(collection(db, "entries"), {
      date,
      weight: parseFloat(weight),
      createdAt: Timestamp.now(),
    });

    setDate("");
    setWeight("");
    alert("Entry Added");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weight (kg)"
        required
      />
      <button type="submit">Save Entry</button>
    </form>
  );
}

export default EntryForm;
