'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import styles from './portfolios.module.css';

export default function Portfolios() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dummy data - replace with Firestore later
  const portfolios = [
    {
      id: 1,
      name: 'Tech Stocks',
      value: '₹1,25,000',
      stocks: 8,
      change: '+15.2%',
      isPositive: true
    },
    {
      id: 2,
      name: 'Blue Chip Portfolio',
      value: '₹95,000',
      stocks: 12,
      change: '+8.5%',
      isPositive: true
    },
    {
      id: 3,
      name: 'Growth Stocks',
      value: '₹69,560',
      stocks: 6,
      change: '+22.3%',
      isPositive: true
    },
    {
      id: 4,
      name: 'Dividend Stocks',
      value: '₹45,000',
      stocks: 10,
      change: '+5.8%',
      isPositive: true
    }
  ];

  // For empty state, use: const portfolios = [];

  const handleAddPortfolio = () => {
    router.push('/add-portfolio');
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

          {/* Add Portfolio Button (top-right) */}
<div className={styles.topRightButton}>
  <button className={styles.addButton} onClick={handleAddPortfolio}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
    Add Portfolio
  </button>
</div>


          {/* Portfolio Grid or Empty State */}
          {portfolios.length > 0 ? (
            <div className={styles.portfolioGrid}>
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className={styles.portfolioCard}>
                  <div className={styles.portfolioHeader}>
                    <div className={styles.portfolioIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <span className={`${styles.portfolioChange} ${portfolio.isPositive ? styles.positive : styles.negative}`}>
                      {portfolio.change}
                    </span>
                  </div>
                  <h3 className={styles.portfolioName}>{portfolio.name}</h3>
                  <div className={styles.portfolioMeta}>
                    <span className={styles.portfolioStocks}>{portfolio.stocks} stocks</span>
                    <span className={styles.portfolioValue}>{portfolio.value}</span>
                  </div>
                  <button 
                    className={styles.viewButton}
                    onClick={() => router.push(`/portfolios/${portfolio.id}`)}
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
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>No Portfolios Yet</h2>
              <p className={styles.emptySubtitle}>
                Start by creating your first investment portfolio.
              </p>
              <button className={styles.createButton} onClick={handleAddPortfolio}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Create Portfolio
              </button>
            </div>
          )}

          {/* Stats Summary */}
          {portfolios.length > 0 && (
            <div className={styles.statsSection}>
              <h2 className={styles.sectionTitle}>Portfolio Summary</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div className={styles.statDetails}>
                    <p className={styles.statLabel}>Total Portfolios</p>
                    <h3 className={styles.statValue}>{portfolios.length}</h3>
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
                    <p className={styles.statLabel}>Total Stocks</p>
                    <h3 className={styles.statValue}>
                      {portfolios.reduce((sum, p) => sum + p.stocks, 0)}
                    </h3>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                  </div>
                  <div className={styles.statDetails}>
                    <p className={styles.statLabel}>Total Value</p>
                    <h3 className={styles.statValue}>₹3,34,560</h3>
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