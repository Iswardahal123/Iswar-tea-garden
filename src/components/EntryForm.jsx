import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const EntryForm = () => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [rate, setRate] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [advanceCut, setAdvanceCut] = useState('');
  const [loading, setLoading] = useState(false);

  const getDayName = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const weightNum = parseFloat(weight || 0);
  const rateNum = parseFloat(rate || 0);
  const paidAmountNum = parseFloat(paidAmount || 0);
  const advanceCutNum = parseFloat(advanceCut || 0);

  const total = (weightNum * rateNum).toFixed(2);
  const due = (total - paidAmountNum - advanceCutNum).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !weight || !rate) {
      alert('Date, weight, and rate are required!');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('User not logged in!');
      return;
    }

    const day = getDayName(date);

    setLoading(true);
    try {
      await addDoc(collection(db, 'entries'), {
        date,
        day,
        weight: weightNum,
        rate: rateNum,
        paidAmount: paidAmountNum,
        advanceCut: advanceCutNum,
        total: parseFloat(total),
        due: parseFloat(due),
        paidStatus: "unpaid",
        createdAt: Timestamp.now(),
        userId: user.uid
      });
      alert('✅ Data saved!');
      setDate('');
      setWeight('');
      setRate('');
      setPaidAmount('');
      setAdvanceCut('');
    } catch (err) {
      console.error('❌ Error:', err);
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

      <input
        type="number"
        placeholder="Rate (₹)"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Paid Amount (₹)"
        value={paidAmount}
        onChange={(e) => setPaidAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="Advance Cut (₹)"
        value={advanceCut}
        onChange={(e) => setAdvanceCut(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount (₹)"
        value={total}
        readOnly
      />

      <input
        type="number"
        placeholder="Due (₹)"
        value={due}
        readOnly
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Entry'}
      </button>
    </form>
  );
};

export default EntryForm;
