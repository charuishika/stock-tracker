'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import styles from './transactions.module.css';

export default function Transactions() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dummy data - replace later with Firestore
  const transactions = [
    {
      id: 1,
      portfolioName: 'Tech Stocks',
      stock: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 20,
      price: 150.0,
      date: '2024-01-12',
    },
    {
      id: 2,
      portfolioName: 'Tech Stocks',
      stock: 'Microsoft Corporation',
      symbol: 'MSFT',
      type: 'buy',
      quantity: 15,
      price: 280.5,
      date: '2024-01-15',
    },
    {
      id: 3,
      portfolioName: 'Blue Chip Portfolio',
      stock: 'Reliance Industries',
      symbol: 'RELIANCE',
      type: 'buy',
      quantity: 50,
      price: 2400.0,
      date: '2024-01-18',
    },
    {
      id: 4,
      portfolioName: 'Growth Stocks',
      stock: 'Tesla Inc.',
      symbol: 'TSLA',
      type: 'sell',
      quantity: 10,
      price: 265.5,
      date: '2024-01-20',
    },
    {
      id: 5,
      portfolioName: 'Tech Stocks',
      stock: 'Alphabet Inc.',
      symbol: 'GOOGL',
      type: 'buy',
      quantity: 25,
      price: 120.0,
      date: '2024-01-22',
    },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateTotal = (t) => t.quantity * t.price;

  return (
    <div className={styles.pageContainer}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`${styles.mainContent} ${
          sidebarCollapsed ? styles.expanded : ''
        }`}
      >
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className={styles.content}>
          {/* CLEANED HEADER (NO REPEATED TITLE) */}
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h2 className={styles.sectionTitleMain}>Your Transactions</h2>
              <p className={styles.pageSubtitle}>
                View and manage all your stock transactions
              </p>
            </div>

            <button className={styles.addButton} onClick={() => router.push('/transactions/add')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Transaction
            </button>
          </div>

          {/* Transaction List */}
          {transactions.length > 0 ? (
            <div className={styles.transactionGrid}>
              {transactions.map((transaction) => (
                <div key={transaction.id} className={styles.transactionCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stockIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    </div>

                    <div className={styles.stockInfo}>
                      <h3 className={styles.stockName}>{transaction.stock}</h3>
                      <p className={styles.stockSymbol}>{transaction.symbol}</p>
                    </div>

                    <span
                      className={`${styles.typeBadge} ${
                        transaction.type === 'buy'
                          ? styles.buyBadge
                          : styles.sellBadge
                      }`}
                    >
                      {transaction.type.toUpperCase()}
                    </span>
                  </div>

                  <div className={styles.portfolioTag}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    {transaction.portfolioName}
                  </div>

                  <div className={styles.transactionDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Quantity</span>
                      <span className={styles.detailValue}>{transaction.quantity}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Price</span>
                      <span className={styles.detailValue}>{formatCurrency(transaction.price)}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Total</span>
                      <span className={styles.detailValue}>
                        {formatCurrency(calculateTotal(transaction))}
                      </span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Date</span>
                      <span className={styles.detailValue}>
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  <button className={styles.viewButton}>
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
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h2 className={styles.emptyTitle}>No Transactions Yet</h2>
              <p className={styles.emptySubtitle}>Start by adding your first stock transaction</p>
              <button className={styles.createButton} onClick={() => router.push('/transactions/add')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add Transaction
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
