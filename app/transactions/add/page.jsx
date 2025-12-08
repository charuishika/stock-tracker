'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from './addTransaction.module.css';

export default function AddTransaction() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    portfolio: '',
    symbol: '',
    stockName: '',
    type: 'buy',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  // Dummy portfolios - replace with Firestore later
  const portfolios = [
    { id: 1, name: 'Tech Stocks' },
    { id: 2, name: 'Blue Chip Portfolio' },
    { id: 3, name: 'Growth Stocks' },
    { id: 4, name: 'Dividend Stocks' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.portfolio) newErrors.portfolio = 'Please select a portfolio';
    if (!formData.symbol.trim()) newErrors.symbol = 'Stock symbol is required';
    if (!formData.stockName.trim()) newErrors.stockName = 'Stock name is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // TODO: Add Firestore logic here
      console.log('Transaction Data:', formData);
      alert('Transaction will be saved (Firestore logic pending)');
      router.push('/transactions');
    }
  };

  const handleCancel = () => {
    router.push('/transactions');
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className={styles.content}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>Add Transaction</h1>
              <p className={styles.pageSubtitle}>
                Record a new buy or sell transaction
              </p>
            </div>
            <div className={styles.headerIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
          </div>

          {/* Form Card */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Portfolio Selection */}
              <div className={styles.formGroup}>
                <label htmlFor="portfolio" className={styles.label}>
                  Portfolio <span className={styles.required}>*</span>
                </label>
                <select
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.portfolio ? styles.error : ''}`}
                >
                  <option value="">Select a portfolio</option>
                  {portfolios.map(portfolio => (
                    <option key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </option>
                  ))}
                </select>
                {errors.portfolio && <p className={styles.errorText}>{errors.portfolio}</p>}
              </div>

              {/* Buy/Sell Toggle */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Transaction Type <span className={styles.required}>*</span>
                </label>
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

              {/* Stock Symbol */}
              <div className={styles.formGroup}>
                <label htmlFor="symbol" className={styles.label}>
                  Stock Symbol <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  placeholder="e.g., AAPL, MSFT, GOOGL"
                  className={`${styles.input} ${errors.symbol ? styles.error : ''}`}
                />
                {errors.symbol && <p className={styles.errorText}>{errors.symbol}</p>}
              </div>

              {/* Stock Name */}
              <div className={styles.formGroup}>
                <label htmlFor="stockName" className={styles.label}>
                  Stock Name <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="stockName"
                  name="stockName"
                  value={formData.stockName}
                  onChange={handleChange}
                  placeholder="e.g., Apple Inc., Microsoft Corporation"
                  className={`${styles.input} ${errors.stockName ? styles.error : ''}`}
                />
                {errors.stockName && <p className={styles.errorText}>{errors.stockName}</p>}
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
                <label htmlFor="date" className={styles.label}>
                  Transaction Date <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.date ? styles.error : ''}`}
                />
                {errors.date && <p className={styles.errorText}>{errors.date}</p>}
              </div>

              {/* Action Buttons */}
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.submitButton}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Save Transaction
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Info Section */}
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <h4 className={styles.infoTitle}>Transaction Tips</h4>
                  <p className={styles.infoText}>
                    Make sure to record the exact price and quantity at the time of transaction. 
                    This helps in accurate profit/loss calculation later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}