import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import './EntryForm.css';

const EntryForm = () => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const getDayName = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !weight) {
      alert('Date and weight required!');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('User not logged in!');
      return;
    }

    const weightNum = parseFloat(weight);
    const rate = 0;
    const paidAmount = 0;
    const advanceCut = 0;
    const total = weightNum * rate;
    const due = total - paidAmount - advanceCut;
    const day = getDayName(date);

    setLoading(true);
    try {
      await addDoc(collection(db, 'entries'), {
        date,
        day,
        weight: weightNum,
        rate,
        paidAmount,
        advanceCut,
        total,
        due,
        paidStatus: "unpaid",
        createdAt: Timestamp.now(),
        userId: user.uid
      });
      alert('✅ Data saved!');
      setDate('');
      setWeight('');
    } catch (err) {
      console.error('❌ Error:', err);
      alert('Error saving data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
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
