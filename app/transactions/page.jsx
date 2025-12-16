'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import styles from './transactions.module.css';

export default function Transactions() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const calculateTotal = (t) => t.quantity * t.price;

  return (
    <div className={styles.pageContainer}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className={styles.content}>
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <h2 className={styles.sectionTitleMain}>Your Transactions</h2>
              <p className={styles.pageSubtitle}>
                View and manage all your stock transactions
              </p>
            </div>

            <button
              className={styles.addButton}
              onClick={() => router.push('/transactions/add')}
            >
              Add Transaction
            </button>
          </div>

          <div className={styles.transactionGrid}>
            {transactions.map((transaction) => (
              <div key={transaction.id} className={styles.transactionCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.stockIcon} />
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
                  {transaction.portfolioName}
                </div>

                <div className={styles.transactionDetails}>
                  <div className={styles.detailRow}>
                    <span>Quantity</span>
                    <span>{transaction.quantity}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Price</span>
                    <span>{formatCurrency(transaction.price)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal(transaction))}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Date</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>

                {/* 🔥 FIXED BUTTON */}
                <button
                  className={styles.viewButton}
                  onClick={() => router.push(`/transactions/${transaction.id}`)}
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
