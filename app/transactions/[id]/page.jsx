'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from './transactionDetails.module.css';

import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export default function TransactionDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH TRANSACTION
  ========================== */
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const ref = doc(db, 'stockTransactions', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setTransaction(null);
          return;
        }

        setTransaction({
          id: snap.id,
          ...snap.data(),
        });
      } catch (err) {
        console.error(err);
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransaction();
  }, [id]);

  /* =========================
     HELPERS
  ========================== */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const calculateTotal = () =>
    transaction ? transaction.quantity * transaction.price : 0;

  /* =========================
     DELETE TRANSACTION
  ========================== */
  const handleDelete = async () => {
    const ok = window.confirm('Delete this transaction permanently?');
    if (!ok) return;

    try {
      await deleteDoc(doc(db, 'stockTransactions', id));
      alert('Transaction deleted');
      router.push('/transactions');
    } catch (err) {
      console.error(err);
      alert('Failed to delete transaction');
    }
  };

  /* =========================
     LOADING
  ========================== */
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className={styles.content}>
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Loading transaction...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* =========================
     NOT FOUND
  ========================== */
  if (!transaction) {
    return (
      <div className={styles.pageContainer}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className={styles.content}>
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2>Transaction Not Found</h2>
              <p>The transaction you're looking for doesn't exist or has been deleted.</p>
              <button className={styles.backButton} onClick={() => router.push('/transactions')}>
                Back to Transactions
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* =========================
     UI
  ========================== */
  return (
    <div className={styles.pageContainer}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className={styles.content}>
          {/* HEADER */}
          <div className={styles.headerWrapper}>
            <button className={styles.backButton} onClick={() => router.push('/transactions')}>
              ← Back
            </button>

            <div className={styles.titleSection}>
              <h1 className={styles.title}>Transaction Details</h1>
            </div>
          </div>

          {/* MAIN CARD */}
          <div className={styles.detailsCard}>
            {/* Stock Header */}
            <div className={styles.stockHeader}>
              <div className={styles.stockIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <div className={styles.stockInfo}>
                <h2 className={styles.stockName}>{transaction.stockName}</h2>
                <p className={styles.stockSymbol}>{transaction.symbol}</p>
              </div>
              <span className={`${styles.typeBadge} ${transaction.buyOrSell === 'buy' ? styles.buyBadge : styles.sellBadge}`}>
                {transaction.buyOrSell.toUpperCase()}
              </span>
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Quantity
                </div>
                <div className={styles.detailValue}>{transaction.quantity}</div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Price per Share
                </div>
                <div className={styles.detailValue}>{formatCurrency(transaction.price)}</div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Transaction Date
                </div>
                <div className={styles.detailValue}>{formatDate(transaction.date)}</div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Total Amount
                </div>
                <div className={`${styles.detailValue} ${styles.totalAmount}`}>
                  {formatCurrency(calculateTotal())}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
  className={styles.editButton}
  onClick={() => router.push(`/transactions/${id}/edit`)}
>

                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Transaction
              </button>

              <button className={styles.deleteButton} onClick={handleDelete}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete Transaction
              </button>
            </div>
          </div>

          {/* PORTFOLIO LINK */}
          {transaction.portfolioId && (
            <div className={styles.relatedSection}>
              <div className={styles.portfolioCard}>
                <div className={styles.portfolioIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className={styles.portfolioInfo}>
                  <span className={styles.portfolioLabel}>Part of Portfolio</span>
                  <button className={styles.viewLink} onClick={() => router.push(`/portfolios/${transaction.portfolioId}`)}>
                    View Portfolio
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}