'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from './portfolioDetails.module.css';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { getTransactions, deletePortfolioCascade } from '@/app/lib/firestoreUtils';

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
     DELETE PORTFOLIO (CASCADE)
  ========================== */
  const handleDeletePortfolio = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${portfolio.portfolioName}"?\n\nThis will permanently delete this portfolio and all its transactions.`
    );

    if (!confirmDelete) return;

    try {
      await deletePortfolioCascade(portfolioId);
      alert('Portfolio deleted successfully');
      router.push('/portfolios');
    } catch (err) {
      console.error(err);
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
              <button className={styles.backButton} onClick={() => router.push('/portfolios')}>
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
          {/* HEADER */}
          <div className={styles.headerWrapper}>
            <button className={styles.backButton} onClick={() => router.push('/portfolios')}>
              ← Back
            </button>

            <div className={styles.titleSection}>
              <div className={styles.titleContent}>
                <h1 className={styles.title}>{portfolio.portfolioName}</h1>
                {portfolio.description && (
                  <p className={styles.description}>{portfolio.description}</p>
                )}
              </div>

              <button className={styles.deleteButton} onClick={handleDeletePortfolio}>
                Delete Portfolio
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Total Invested</p>
              <h3 className={styles.statValue}>{formatCurrency(totalInvestment)}</h3>
            </div>

            <div className={styles.statCard}>
              <p className={styles.statLabel}>Transactions</p>
              <h3 className={styles.statValue}>{transactions.length}</h3>
            </div>

            <div className={styles.statCard}>
              <p className={styles.statLabel}>Net Value</p>
              <h3 className={`${styles.statValue} ${netValue >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                {formatCurrency(netValue)}
              </h3>
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className={styles.stockSection}>
            <h2 className={styles.sectionTitle}>Transactions</h2>

            {transactions.length === 0 ? (
              <p>No transactions yet.</p>
            ) : (
              <div className={styles.stockList}>
                {transactions.map(txn => (
                  <div key={txn.id} className={styles.stockCard}>
                    <h3>{txn.stockName}</h3>
                    <p>{txn.symbol}</p>
                    <p>
                      {txn.buyOrSell.toUpperCase()} · {txn.quantity} × {formatCurrency(txn.price)}
                    </p>
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
