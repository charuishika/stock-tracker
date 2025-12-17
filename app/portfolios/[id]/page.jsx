'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from './portfolioDetails.module.css';

import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { getTransactions } from '@/app/lib/firestoreUtils';
import { deleteTransaction } from '@/app/lib/firestoreUtils';


export default function PortfolioDetails() {
  const params = useParams();
  const router = useRouter();
  const portfolioId = params.id;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PORTFOLIO + TXNS
  ========================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const portfolioRef = doc(db, 'portfolios', portfolioId);
        const snap = await getDoc(portfolioRef);

        if (!snap.exists()) {
          setPortfolio(null);
          return;
        }

        setPortfolio({
          id: snap.id,
          ...snap.data(),
        });

        const txns = await getTransactions(portfolioId);
        setTransactions(txns);
      } catch (err) {
        console.error(err);
        setPortfolio(null);
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId) fetchData();
  }, [portfolioId]);

  /* =========================
     DELETE PORTFOLIO
  ========================== */
  const handleDeletePortfolio = async () => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${portfolio.portfolioName}"?\n\nThis will permanently delete this portfolio and all its transactions.`
  );

  if (!confirmDelete) return;

  try {
    // 1️⃣ Delete all transactions under this portfolio
    for (const txn of transactions) {
      await deleteTransaction(txn.id);
    }

    // 2️⃣ Delete portfolio
    await deleteDoc(doc(db, 'portfolios', portfolioId));

    alert('Portfolio and its transactions deleted successfully');
    router.push('/portfolios');

  } catch (err) {
    console.error('Cascade delete failed:', err);
    alert('Failed to delete portfolio. Try again.');
  }
};


  /* =========================
     CALCULATIONS
  ========================== */
  const totalInvestment = transactions
    .filter(t => t.buyOrSell === 'buy')
    .reduce((sum, t) => sum + t.quantity * t.price, 0);

  const totalSold = transactions
    .filter(t => t.buyOrSell === 'sell')
    .reduce((sum, t) => sum + t.quantity * t.price, 0);

  const netValue = totalInvestment - totalSold;

  const formatCurrency = amount =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

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
              <p>Loading portfolio...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className={styles.pageContainer}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className={styles.content}>
            <div className={styles.errorContainer}>
              <h2>Portfolio Not Found</h2>
              <p>The portfolio you're looking for doesn't exist.</p>
              <button 
                className={styles.backButton}
                onClick={() => router.push('/portfolios')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back to Portfolios
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
          {/* HEADER - ORGANIZED LAYOUT */}
          <div className={styles.headerWrapper}>
            <button 
              className={styles.backButton} 
              onClick={() => router.push('/portfolios')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Portfolios
            </button>

            <div className={styles.titleSection}>
              <div className={styles.titleContent}>
                <h1 className={styles.title}>{portfolio.portfolioName}</h1>
                {portfolio.description && (
                  <p className={styles.description}>{portfolio.description}</p>
                )}
              </div>

              <button 
                className={styles.deleteButton} 
                onClick={handleDeletePortfolio}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete Portfolio
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className={styles.statDetails}>
                <p className={styles.statLabel}>Total Invested</p>
                <h3 className={styles.statValue}>{formatCurrency(totalInvestment)}</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <div className={styles.statDetails}>
                <p className={styles.statLabel}>Total Transactions</p>
                <h3 className={styles.statValue}>{transactions.length}</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ 
                background: netValue >= 0 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={netValue >= 0 ? "23 6 13.5 15.5 8.5 10.5 1 18" : "23 18 13.5 8.5 8.5 13.5 1 6"}></polyline>
                  <polyline points={netValue >= 0 ? "17 6 23 6 23 12" : "17 18 23 18 23 12"}></polyline>
                </svg>
              </div>
              <div className={styles.statDetails}>
                <p className={styles.statLabel}>Net Value</p>
                <h3 className={`${styles.statValue} ${netValue >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                  {formatCurrency(netValue)}
                </h3>
              </div>
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className={styles.stockSection}>
            <h2 className={styles.sectionTitle}>Transactions</h2>

            {transactions.length === 0 ? (
              <div className={styles.emptyTransactions}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3>No Transactions Yet</h3>
                <p>Start adding transactions to track this portfolio</p>
              </div>
            ) : (
              <div className={styles.stockList}>
                {transactions.map(txn => (
                  <div key={txn.id} className={styles.stockCard}>
                    <div className={styles.stockHeader}>
                      <div className={styles.stockIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                      </div>
                      <div className={styles.stockInfo}>
                        <h3 className={styles.stockName}>{txn.stockName}</h3>
                        <p className={styles.stockSymbol}>{txn.symbol}</p>
                      </div>
                      <span className={`${styles.typeBadge} ${txn.buyOrSell === 'buy' ? styles.buyBadge : styles.sellBadge}`}>
                        {txn.buyOrSell.toUpperCase()}
                      </span>
                    </div>

                    <div className={styles.stockDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Quantity</span>
                        <span className={styles.detailValue}>{txn.quantity}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Price</span>
                        <span className={styles.detailValue}>{formatCurrency(txn.price)}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Total</span>
                        <span className={styles.detailValue}>{formatCurrency(txn.quantity * txn.price)}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Date</span>
                        <span className={styles.detailValue}>
                          {new Date(txn.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}