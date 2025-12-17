'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from './addTransaction.module.css';

import { getPortfolios, addTransaction } from '@/app/lib/firestoreUtils';

export default function AddTransaction() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* =========================
     STATE
  ========================== */
  const [portfolios, setPortfolios] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    portfolio: '',
    symbol: '',
    stockName: '',
    type: 'buy',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
  });

  /* =========================
     FETCH PORTFOLIOS
  ========================== */
  useEffect(() => {
    const fetchPortfolios = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.uid) return;

      const data = await getPortfolios(userData.uid);
      setPortfolios(data);
    };

    fetchPortfolios();
  }, []);

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeToggle = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };

  /* =========================
     VALIDATION
  ========================== */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.portfolio) newErrors.portfolio = 'Select a portfolio';
    if (!formData.symbol.trim()) newErrors.symbol = 'Symbol required';
    if (!formData.stockName.trim()) newErrors.stockName = 'Stock name required';
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = 'Quantity must be > 0';
    if (!formData.price || formData.price <= 0)
      newErrors.price = 'Price must be > 0';
    if (!formData.date) newErrors.date = 'Date required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const txnData = {
        portfolioId: formData.portfolio,
        buyOrSell: formData.type,
        stockName: formData.stockName.trim(),
        symbol: formData.symbol.trim().toUpperCase(),
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        date: formData.date,
      };

      await addTransaction(txnData);

      alert('Transaction added successfully');
      router.push('/transactions');
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction');
    }
  };

  const handleCancel = () => {
    router.push('/transactions');
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className={styles.pageContainer}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className={styles.content}>
          {/* HEADER */}
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Add Transaction</h1>
              <p className={styles.pageSubtitle}>Record a new buy or sell transaction</p>
            </div>
          </div>

          {/* FORM */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>

              {/* Portfolio */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Portfolio <span className={styles.required}>*</span>
                </label>
                <select
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.portfolio ? styles.error : ''}`}
                >
                  <option value="">Select a portfolio</option>
                  {portfolios.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.portfolioName}
                    </option>
                  ))}
                </select>
                {errors.portfolio && <p className={styles.errorText}>{errors.portfolio}</p>}
              </div>

              {/* Buy / Sell */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Transaction Type *</label>
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${formData.type === 'buy' ? styles.buyActive : ''}`}
                    onClick={() => handleTypeToggle('buy')}
                  >
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    Buy
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleButton} ${formData.type === 'sell' ? styles.sellActive : ''}`}
                    onClick={() => handleTypeToggle('sell')}
                  >
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                      <polyline points="17 18 23 18 23 12"></polyline>
                    </svg>
                    Sell
                  </button>
                </div>
              </div>

              {/* Symbol */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock Symbol *</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock Name *</label>
                <input
                  type="text"
                  name="stockName"
                  value={formData.stockName}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              
              {/* Quantity and Price Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="quantity" className={styles.label}>
                    Quantity <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="1"
                    className={`${styles.input} ${errors.quantity ? styles.error : ''}`}
                  />
                  {errors.quantity && <p className={styles.errorText}>{errors.quantity}</p>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>
                    Price (₹) <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    className={`${styles.input} ${errors.price ? styles.error : ''}`}
                  />
                  {errors.price && <p className={styles.errorText}>{errors.price}</p>}
                </div>
              </div>


              {/* Date */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Transaction
                </button>
                <button type="button" onClick={handleCancel} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
