import React, { useState } from 'react';

const EntryForm = ({ onSubmit }) => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !weight) return alert('All fields required!');
    onSubmit({ date, weight: parseFloat(weight) });
    setDate('');
    setWeight('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <button type="submit">Add Entry</button>
    </form>
  );
};

export default EntryForm;
