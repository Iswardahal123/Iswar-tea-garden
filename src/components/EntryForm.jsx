import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const EntryForm = () => {
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [rate, setRate] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [advanceCut, setAdvanceCut] = useState('');
  const [day, setDay] = useState('');
  const [paidStatus, setPaidStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !weight) {
      alert('Date and weight are required!');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in");
      return;
    }

    const weightNum = parseFloat(weight);
    const rateNum = parseFloat(rate) || 0;
    const paidNum = parseFloat(paidAmount) || 0;
    const advanceNum = parseFloat(advanceCut) || 0;
    const total = weightNum * rateNum;
    const due = total - paidNum - advanceNum;

    setLoading(true);
    try {
      await addDoc(collection(db, 'entries'), {
        date,
        day,
        weight: weightNum,
        rate: rateNum,
        paidAmount: paidNum,
        advanceCut: advanceNum,
        total,
        due,
        paidStatus,
        createdAt: Timestamp.now(),
        userId: user.uid
      });
      alert('✅ Data saved successfully!');
      setDate('');
      setWeight('');
      setRate('');
      setPaidAmount('');
      setAdvanceCut('');
      setDay('');
      setPaidStatus('');
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
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="text" placeholder="Day" value={day} onChange={(e) => setDay(e.target.value)} />
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} required />
      <input type="number" placeholder="Rate" value={rate} onChange={(e) => setRate(e.target.value)} />
      <input type="number" placeholder="Paid Amount" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
      <input type="number" placeholder="Advance Cut" value={advanceCut} onChange={(e) => setAdvanceCut(e.target.value)} />
      <input type="text" placeholder="Paid Status" value={paidStatus} onChange={(e) => setPaidStatus(e.target.value)} />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Entry'}
      </button>
    </form>
  );
};

export default EntryForm;
