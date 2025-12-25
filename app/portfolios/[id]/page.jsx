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

  // Calculate holdings by stock
  const holdings = transactions.reduce((acc, txn) => {
    const symbol = txn.symbol;
    if (!acc[symbol]) {
      acc[symbol] = {
        stockName: txn.stockName,
        symbol: txn.symbol,
        quantity: 0,
        totalCost: 0,
        transactions: []
      };
    }
    
    if (txn.buyOrSell === 'buy') {
      acc[symbol].quantity += txn.quantity;
      acc[symbol].totalCost += txn.quantity * txn.price;
    } else {
      acc[symbol].quantity -= txn.quantity;
    }
    
    acc[symbol].transactions.push(txn);
    
    return acc;
  }, {});

  // Convert to array and filter out zero holdings
  const activeHoldings = Object.values(holdings)
    .filter(h => h.quantity > 0)
    .map(h => ({
      ...h,
      avgPrice: h.totalCost / h.quantity
    }));

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date) - new Date(a.date);
  });

  const formatCurrency = amount =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
              <p>The portfolio you're looking for doesn't exist or has been deleted.</p>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className={styles.statDetails}>
                <p className={styles.statLabel}>Total Invested</p>
                <h3 className={styles.statValue}>{formatCurrency(totalInvestment)}</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div className={styles.statDetails}>
                <p className={styles.statLabel}>Active Holdings</p>
                <h3 className={styles.statValue}>{activeHoldings.length}</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: netValue >= 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
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

          {/* CURRENT HOLDINGS */}
          {activeHoldings.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Current Holdings</h2>
              
              <div className={styles.holdingsList}>
                {activeHoldings.map(holding => (
                  <div key={holding.symbol} className={styles.holdingCard}>
                    <div className={styles.holdingHeader}>
                      <div className={styles.holdingIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                      <div className={styles.holdingInfo}>
                        <h3 className={styles.holdingName}>{holding.stockName}</h3>
                        <p className={styles.holdingSymbol}>{holding.symbol}</p>
                      </div>
                    </div>

                    <div className={styles.holdingDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Quantity</span>
                        <span className={styles.detailValue}>{holding.quantity}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Avg Price</span>
                        <span className={styles.detailValue}>{formatCurrency(holding.avgPrice)}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Total Value</span>
                        <span className={styles.detailValue}>{formatCurrency(holding.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL TRANSACTIONS */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              All Transactions
              <span className={styles.transactionCount}>{transactions.length}</span>
            </h2>

            {sortedTransactions.length === 0 ? (
              <div className={styles.emptyTransactions}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3>No Transactions Yet</h3>
                <p>Start adding transactions to track your portfolio performance</p>
              </div>
            ) : (
              <div className={styles.transactionsList}>
                {sortedTransactions.map(txn => (
                  <div key={txn.id} className={styles.transactionCard}>
                    <div className={styles.transactionHeader}>
                      <div className={styles.transactionInfo}>
                        <h3 className={styles.transactionStock}>{txn.stockName}</h3>
                        <p className={styles.transactionSymbol}>{txn.symbol}</p>
                      </div>
                      <span className={`${styles.typeBadge} ${txn.buyOrSell === 'buy' ? styles.buyBadge : styles.sellBadge}`}>
                        {txn.buyOrSell.toUpperCase()}
                      </span>
                    </div>

                    <div className={styles.transactionDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Date</span>
                        <span className={styles.detailValue}>{formatDate(txn.date)}</span>
                      </div>
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
                        <span className={`${styles.detailValue} ${styles.totalAmount}`}>
                          {formatCurrency(txn.quantity * txn.price)}
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