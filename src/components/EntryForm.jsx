import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const EntryForm = () => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !weight) {
      alert('All fields required!');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'pattaEntries'), {
        date,
        weight: parseFloat(weight),
        createdAt: Timestamp.now()
      });
      alert('✅ Data saved successfully!');
      setDate('');
      setWeight('');
    } catch (error) {
      console.error('❌ Error adding document: ', error);
      alert('Error saving data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>🌿 Add New Entry</h3>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Entry'}
      </button>
    </form>
  );
};

export default EntryForm;
