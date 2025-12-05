'use client';

import "@/app/lib/firestoreUtils";


import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dummy data for stats cards
  const statsData = [
    {
      id: 1,
      label: 'Total Investment',
      value: '₹2,45,000',
      change: '+12.5%',
      changeLabel: 'from last month',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
    },
    {
      id: 2,
      label: 'Current Value',
      value: '₹2,89,560',
      change: '+18.2%',
      changeLabel: 'growth',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)'
    },
    {
      id: 3,
      label: 'Total Profit / Loss',
      value: '+₹44,560',
      change: '+18.2%',
      changeLabel: 'returns',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 4,
      label: "Today's Gain / Loss",
      value: '+₹1,250',
      change: '+0.43%',
      changeLabel: 'today',
      isPositive: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  ];

  // Dummy portfolio data
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
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className={styles.dashboardContent}>
          {/* Stats Cards Grid */}
          <div className={styles.statsGrid}>
            {statsData.map((stat) => (
              <div key={stat.id} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: stat.gradient }}>
                  {stat.icon}
                </div>
                <div className={styles.statDetails}>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                  <p className={`${styles.statChange} ${stat.isPositive ? styles.positive : styles.negative}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points={stat.isPositive ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                    </svg>
                    <span>{stat.change} {stat.changeLabel}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className={styles.chartSection}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h2 className={styles.chartTitle}>Portfolio Performance</h2>
                <div className={styles.chartActions}>
                  <button className={styles.chartButton}>1D</button>
                  <button className={styles.chartButton}>1W</button>
                  <button className={`${styles.chartButton} ${styles.active}`}>1M</button>
                  <button className={styles.chartButton}>3M</button>
                  <button className={styles.chartButton}>1Y</button>
                  <button className={styles.chartButton}>All</button>
                </div>
              </div>
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartPlaceholderContent}>
                  <svg className={styles.chartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <p>Chart placeholder</p>
                  <span>Implement with Chart.js or Recharts later</span>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio List */}
          <div className={styles.portfolioSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>My Portfolios</h2>
              <button className={styles.viewAllButton}>
                View All
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            
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
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}