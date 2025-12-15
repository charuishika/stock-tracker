'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from './transactionDetails.module.css';

// Placeholder async function - replace with Firestore later
async function getTransactionDetails(transactionId) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  const transactions = {
    '1': {
      id: '1',
      portfolioName: 'Tech Stocks',
      portfolioId: '1',
      stock: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'buy',
      quantity: 20,
      price: 150.00,
      date: '2024-01-12',
      notes: 'Good entry point after market correction'
    },
    '2': {
      id: '2',
      portfolioName: 'Tech Stocks',
      portfolioId: '1',
      stock: 'Microsoft Corporation',
      symbol: 'MSFT',
      type: 'buy',
      quantity: 15,
      price: 280.50,
      date: '2024-01-15',
      notes: 'Strong fundamentals and AI growth potential'
    },
    '3': {
      id: '3',
      portfolioName: 'Blue Chip Portfolio',
      portfolioId: '2',
      stock: 'Reliance Industries',
      symbol: 'RELIANCE',
      type: 'buy',
      quantity: 50,
      price: 2400.00,
      date: '2024-01-18',
      notes: 'Market leader with consistent performance'
    },
    '4': {
      id: '4',
      portfolioName: 'Growth Stocks',
      portfolioId: '3',
      stock: 'Tesla Inc.',
      symbol: 'TSLA',
      type: 'sell',
      quantity: 10,
      price: 265.50,
      date: '2024-01-20',
      notes: 'Profit booking after reaching target price'
    },
    '5': {
      id: '5',
      portfolioName: 'Tech Stocks',
      portfolioId: '1',
      stock: 'Alphabet Inc.',
      symbol: 'GOOGL',
      type: 'buy',
      quantity: 25,
      price: 120.00,
      date: '2024-01-22',
      notes: 'Undervalued with strong cloud business'
    }
  };
  
  return transactions[transactionId] || null;
}

export default function TransactionDetails() {
  const params = useParams();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTransactionDetails(params.id);
      setTransaction(data);
      setLoading(false);
    };
    
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateTotal = () => {
    if (!transaction) return 0;
    return transaction.quantity * transaction.price;
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          
          <main className={styles.content}>
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Loading transaction...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className={styles.pageContainer}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
          <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          
          <main className={styles.content}>
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2>Transaction Not Found</h2>
              <p>The transaction you're looking for doesn't exist.</p>
              <button 
                className={styles.backButton}
                onClick={() => router.push('/transactions')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back to Transactions
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className={styles.content}>
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/transactions')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Transactions
            </button>
            <h1 className={styles.title}>Transaction Details</h1>
            <p className={styles.subtitle}>
              View complete information about this transaction
            </p>
          </div>

          {/* Transaction Details Card */}
          <div className={styles.detailsCard}>
            {/* Stock Header */}
            <div className={styles.stockHeader}>
              <div className={styles.stockIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div className={styles.stockInfo}>
                <h2 className={styles.stockName}>{transaction.stock}</h2>
                <p className={styles.stockSymbol}>{transaction.symbol}</p>
              </div>
              <span className={`${styles.typeBadge} ${transaction.type === 'buy' ? styles.buyBadge : styles.sellBadge}`}>
                {transaction.type.toUpperCase()}
              </span>
            </div>

            {/* Portfolio Tag */}
            <div className={styles.portfolioSection}>
              <div className={styles.portfolioTag}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                {transaction.portfolioName}
              </div>
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  Quantity
                </div>
                <div className={styles.detailValue}>{transaction.quantity}</div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Price per Share
                </div>
                <div className={styles.detailValue}>{formatCurrency(transaction.price)}</div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Transaction Date
                </div>
                <div className={styles.detailValue}>{formatDate(transaction.date)}</div>
              </div>

              <div className={styles.detailItem}>
                <div className={styles.detailLabel}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  Total Amount
                </div>
                <div className={`${styles.detailValue} ${styles.totalAmount}`}>
                  {formatCurrency(calculateTotal())}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {transaction.notes && (
              <div className={styles.notesSection}>
                <h3 className={styles.notesTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Notes
                </h3>
                <p className={styles.notesText}>{transaction.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.editButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Transaction
              </button>
              <button className={styles.deleteButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete Transaction
              </button>
            </div>
          </div>

          {/* Related Transactions */}
          <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>Related Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon} style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Portfolio</p>
                  <h4 className={styles.infoValue}>{transaction.portfolioName}</h4>
                  <button 
                    className={styles.viewLink}
                    onClick={() => router.push(`/portfolios/${transaction.portfolioId}`)}
                  >
                    View Portfolio →
                  </button>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon} style={{ background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Transaction Type</p>
                  <h4 className={styles.infoValue}>
                    {transaction.type === 'buy' ? 'Buy Order' : 'Sell Order'}
                  </h4>
                  <p className={styles.infoDescription}>
                    {transaction.type === 'buy' 
                      ? 'Added to your portfolio' 
                      : 'Removed from your portfolio'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}