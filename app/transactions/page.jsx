'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import styles from './transactions.module.css';

import { getAllTransactions } from '@/app/lib/firestoreUtils';

export default function Transactions() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH TRANSACTIONS
  ========================== */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.uid) return;

        const data = await getAllTransactions(userData.uid);
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const handleAddTransaction = () => {
    router.push('/transactions/add');
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
              <p>Loading transactions...</p>
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
          {/* Add Transaction Button - Top Right */}
          <div className={styles.topRightButton}>
            <button className={styles.addButton} onClick={handleAddTransaction}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Transaction
            </button>
          </div>

          {/* Transaction Grid or Empty State */}
          {transactions.length > 0 ? (
            <div className={styles.transactionGrid}>
              {transactions.map((t) => (
                <div key={t.id} className={styles.transactionCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stockIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>
                    <div className={styles.stockInfo}>
                      <h3 className={styles.stockName}>{t.stockName}</h3>
                      <p className={styles.stockSymbol}>{t.symbol}</p>
                    </div>
                    <span
                      className={`${styles.typeBadge} ${
                        t.buyOrSell === 'buy' ? styles.buyBadge : styles.sellBadge
                      }`}
                    >
                      {t.buyOrSell.toUpperCase()}
                    </span>
                  </div>

                  {t.portfolioName && (
                    <div className={styles.portfolioTag}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                      {t.portfolioName}
                    </div>
                  )}

                  <div className={styles.transactionDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Quantity</span>
                      <span className={styles.detailValue}>{t.quantity}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Price</span>
                      <span className={styles.detailValue}>{formatCurrency(t.price)}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Total</span>
                      <span className={styles.detailValue}>{formatCurrency(t.quantity * t.price)}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Date</span>
                      <span className={styles.detailValue}>{formatDate(t.date)}</span>
                    </div>
                  </div>

                  <button
                    className={styles.viewButton}
                    onClick={() => router.push(`/transactions/${t.id}`)}
                  >
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>No Transactions Yet</h2>
              <p className={styles.emptySubtitle}>
                Start by adding your first stock transaction
              </p>
              <button className={styles.createButton} onClick={handleAddTransaction}>
                Add Transaction
              </button>
            </div>
          )}

          {/* Summary Stats */}
          {transactions.length > 0 && (
            <div className={styles.summarySection}>
              <h2 className={styles.sectionTitle}>Summary</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon} style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <div className={styles.summaryDetails}>
                    <p className={styles.summaryLabel}>Total Transactions</p>
                    <h3 className={styles.summaryValue}>{transactions.length}</h3>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </div>
                  <div className={styles.summaryDetails}>
                    <p className={styles.summaryLabel}>Buy Transactions</p>
                    <h3 className={styles.summaryValue}>
                      {transactions.filter(t => t.buyOrSell === 'buy').length}
                    </h3>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                      <polyline points="17 18 23 18 23 12"></polyline>
                    </svg>
                  </div>
                  <div className={styles.summaryDetails}>
                    <p className={styles.summaryLabel}>Sell Transactions</p>
                    <h3 className={styles.summaryValue}>
                      {transactions.filter(t => t.buyOrSell === 'sell').length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}