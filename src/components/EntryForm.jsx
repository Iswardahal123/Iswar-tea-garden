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

    const weightNum = parseFloat(weight);
    const rateNum = parseFloat(rate);
    const paidAmountNum = parseFloat(paidAmount || 0);
    const advanceCutNum = parseFloat(advanceCut || 0);

    const total = weightNum * rateNum;
    const due = total - paidAmountNum - advanceCutNum;
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
        total,
        due,
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

  // Auto-calculated total & due
  const total = (parseFloat(weight || 0) * parseFloat(rate || 0)).toFixed(2);
  const due = (total - parseFloat(paidAmount || 0) - parseFloat(advanceCut || 0)).toFixed(2);

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

      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <strong>💰 Total:</strong> ₹{total} <br />
        <strong>🧾 Due:</strong> ₹{due}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Entry'}
      </button>
    </form>
  );
};

export default EntryForm;
