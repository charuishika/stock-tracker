'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export default function EditTransaction() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      const snap = await getDoc(doc(db, 'stockTransactions', id));
      if (!snap.exists()) {
        alert('Transaction not found');
        router.push('/transactions');
        return;
      }
      setFormData(snap.data());
      setLoading(false);
    };

    fetchTransaction();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, 'stockTransactions', id), {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    });

    alert('Transaction updated');
    router.push(`/transactions/${id}`);
  };

  if (loading || !formData) return <p>Loading...</p>;

  return (
    <form onSubmit={handleUpdate} style={{ padding: 40 }}>
      <h2>Edit Transaction</h2>

      <input
        name="stockName"
        value={formData.stockName}
        onChange={handleChange}
      />

      <input
        name="symbol"
        value={formData.symbol}
        onChange={handleChange}
      />

      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
      />

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
      />

      <button type="submit">Update</button>
    </form>
  );
}
