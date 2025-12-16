'use client';

import { useState, useEffect } from 'react';
import styles from './AddPortfolioModal.module.css';
import { createPortfolio } from '@/app/lib/firestoreUtils';

export default function AddPortfolioModal({ onClose, onPortfolioAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Portfolio name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user =
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('userData'))
        : null;

    if (!user?.uid) {
      alert('User not authenticated');
      return;
    }

    try {
      setLoading(true);

      await createPortfolio(user.uid, formData.name.trim());

      // refresh portfolio list in parent
      if (onPortfolioAdded) onPortfolioAdded();

      onClose();
    } catch (err) {
      alert('Failed to create portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.iconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h2 className={styles.modalTitle}>Add Portfolio</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Portfolio Name <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tech Stocks"
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              autoFocus
            />
            {errors.name && <p className={styles.errorText}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Description <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={styles.textarea}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
