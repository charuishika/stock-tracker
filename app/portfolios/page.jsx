'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AddPortfolioModal from '../components/AddPortfolioModal';
import { getPortfolios } from '@/app/lib/firestoreUtils';
import styles from './portfolios.module.css';

export default function Portfolios() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user from localStorage
  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('userData'))
      : null;

  // Fetch portfolios from Firestore
  const fetchPortfolios = async () => {
    if (!user?.uid) return;
    setLoading(true);
    const data = await getPortfolios(user.uid);
    setPortfolios(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

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
          {!loading && portfolios.length > 0 ? (
            <div className={styles.portfolioGrid}>
              {portfolios.map((portfolio) => (
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
                    <span className={styles.portfolioStocks}>0 stocks</span>
                    <span className={styles.portfolioValue}>₹0</span>
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
              ))}
            </div>
          ) : !loading ? (
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>No Portfolios Yet</h2>
              <p className={styles.emptySubtitle}>
                Start by creating your first investment portfolio.
              </p>
              <button className={styles.createButton} onClick={() => setShowModal(true)}>
                Create Portfolio
              </button>
            </div>
          ) : (
            <p>Loading portfolios...</p>
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
