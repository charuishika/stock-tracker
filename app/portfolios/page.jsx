'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AddPortfolioModal from '../components/AddPortfolioModal';
import { getPortfolios, getTransactions } from '@/app/lib/firestoreUtils';
import styles from './portfolios.module.css';

export default function Portfolios() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Get logged-in user from localStorage
  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('userData'))
      : null;

  // Calculate portfolio statistics from transactions
  const calculatePortfolioStats = async (portfolioId) => {
    try {
      const transactions = await getTransactions(portfolioId);
      
      // Get unique stocks
      const uniqueStocks = new Set(transactions.map(t => t.symbol)).size;
      
      // Calculate total value (buy - sell)
      const totalBuy = transactions
        .filter(t => t.buyOrSell === 'buy')
        .reduce((sum, t) => sum + (t.quantity * t.price), 0);
      
      const totalSell = transactions
        .filter(t => t.buyOrSell === 'sell')
        .reduce((sum, t) => sum + (t.quantity * t.price), 0);
      
      const netValue = totalBuy - totalSell;
      
      return {
        stockCount: uniqueStocks,
        totalValue: netValue
      };
    } catch (error) {
      console.error('Error calculating portfolio stats:', error);
      return {
        stockCount: 0,
        totalValue: 0
      };
    }
  };

  // Fetch portfolios from Firestore
  const fetchPortfolios = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const data = await getPortfolios(user.uid);
      setPortfolios(data);
      
      // Fetch stats for each portfolio
      const statsPromises = data.map(async (portfolio) => {
        const stats = await calculatePortfolioStats(portfolio.id);
        return { id: portfolio.id, ...stats };
      });
      
      const allStats = await Promise.all(statsPromises);
      
      // Convert to object for easy lookup
      const statsMap = {};
      allStats.forEach(stat => {
        statsMap[stat.id] = stat;
      });
      
      setPortfolioStats(statsMap);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
          {/* Add Portfolio Button */}
          <div className={styles.topRightButton}>
            <button className={styles.addButton} onClick={() => setShowModal(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add Portfolio
            </button>
          </div>

          {/* Portfolio Grid */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Loading portfolios...</p>
            </div>
          ) : portfolios.length > 0 ? (
            <div className={styles.portfolioGrid}>
              {portfolios.map((portfolio) => {
                const stats = portfolioStats[portfolio.id] || { stockCount: 0, totalValue: 0 };
                
                return (
                  <div key={portfolio.id} className={styles.portfolioCard}>
                    <div className={styles.portfolioHeader}>
                      <div className={styles.portfolioIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      </div>
                    </div>

                    <h3 className={styles.portfolioName}>
                      {portfolio.portfolioName}
                    </h3>

                    <div className={styles.portfolioMeta}>
                      <span className={styles.portfolioStocks}>
                        {stats.stockCount} {stats.stockCount === 1 ? 'stock' : 'stocks'}
                      </span>
                      <span className={styles.portfolioValue}>
                        {formatCurrency(stats.totalValue)}
                      </span>
                    </div>

                    <button
                      className={styles.viewButton}
                      onClick={() => router.push(`/portfolios/${portfolio.id}`)}
                    >
                      View Details
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>No Portfolios Yet</h2>
              <p className={styles.emptySubtitle}>
                Start by creating your first investment portfolio.
              </p>
              <button className={styles.createButton} onClick={() => setShowModal(true)}>
                Create Portfolio
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Add Portfolio Modal */}
      {showModal && (
        <AddPortfolioModal
          onClose={() => setShowModal(false)}
          onPortfolioAdded={fetchPortfolios}
        />
      )}
    </div>
  );
}