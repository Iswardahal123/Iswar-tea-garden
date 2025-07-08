import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const EntryFormPage = () => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !weight) return alert("All fields required!");

    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    setLoading(true);
    try {
      await addDoc(collection(db, 'entries'), {
        date,
        weight: parseFloat(weight),
        createdAt: Timestamp.now(),
        userId: user.uid,
        rate: 0,
        total: 0,
        paidAmount: 0,
        advanceCut: 0,
        due: 0,
        paidStatus: 'unpaid',
        day: new Date(date).toLocaleString('en-US', { weekday: 'long' })
      });
      alert('✅ Entry saved!');
      setDate('');
      setWeight('');
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Entry</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
    </form>
  );
};

export default EntryFormPage;
