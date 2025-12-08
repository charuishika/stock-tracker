'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from './portfolioDetails.module.css';

// Placeholder async function - replace with Firestore later
async function getPortfolioData(portfolioId) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  const portfolios = {
    '1': {
      id: '1',
      name: 'Tech Stocks',
      totalValue: 125000,
      totalInvestment: 108500,
      stocks: [
        {
          id: 's1',
          name: 'Apple Inc.',
          symbol: 'AAPL',
          quantity: 50,
          buyPrice: 150.00,
          currentPrice: 175.50,
        },
        {
          id: 's2',
          name: 'Microsoft Corporation',
          symbol: 'MSFT',
          quantity: 30,
          buyPrice: 280.00,
          currentPrice: 325.75,
        },
        {
          id: 's3',
          name: 'Alphabet Inc.',
          symbol: 'GOOGL',
          quantity: 25,
          buyPrice: 120.00,
          currentPrice: 135.20,
        },
        {
          id: 's4',
          name: 'Amazon.com Inc.',
          symbol: 'AMZN',
          quantity: 20,
          buyPrice: 140.00,
          currentPrice: 155.80,
        }
      ]
    },
    '2': {
      id: '2',
      name: 'Blue Chip Portfolio',
      totalValue: 95000,
      totalInvestment: 87500,
      stocks: [
        {
          id: 's5',
          name: 'Reliance Industries',
          symbol: 'RELIANCE',
          quantity: 100,
          buyPrice: 2400.00,
          currentPrice: 2650.00,
        },
        {
          id: 's6',
          name: 'HDFC Bank',
          symbol: 'HDFCBANK',
          quantity: 80,
          buyPrice: 1550.00,
          currentPrice: 1620.00,
        },
        {
          id: 's7',
          name: 'Infosys Ltd',
          symbol: 'INFY',
          quantity: 120,
          buyPrice: 1450.00,
          currentPrice: 1580.00,
        }
      ]
    },
    '3': {
      id: '3',
      name: 'Growth Stocks',
      totalValue: 69560,
      totalInvestment: 56800,
      stocks: [
        {
          id: 's8',
          name: 'Tesla Inc.',
          symbol: 'TSLA',
          quantity: 15,
          buyPrice: 220.00,
          currentPrice: 265.50,
        },
        {
          id: 's9',
          name: 'NVIDIA Corporation',
          symbol: 'NVDA',
          quantity: 25,
          buyPrice: 450.00,
          currentPrice: 520.00,
        }
      ]
    },
    '4': {
      id: '4',
      name: 'Dividend Stocks',
      totalValue: 45000,
      totalInvestment: 42500,
      stocks: [
        {
          id: 's10',
          name: 'Coca-Cola Company',
          symbol: 'KO',
          quantity: 100,
          buyPrice: 58.00,
          currentPrice: 61.50,
        },
        {
          id: 's11',
          name: 'Johnson & Johnson',
          symbol: 'JNJ',
          quantity: 50,
          buyPrice: 160.00,
          currentPrice: 168.00,
        }
      ]
    }
  };
  
  return portfolios[portfolioId] || null;
}

export default function PortfolioDetails() {
  const params = useParams();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPortfolioData(params.id);
      setPortfolio(data);
      setLoading(false);
    };
    
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const calculateProfitLoss = (stock) => {
    const profit = (stock.currentPrice - stock.buyPrice) * stock.quantity;
    const profitPercentage = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;
    return { profit, profitPercentage };
  };

  const calculateTotalProfitLoss = () => {
    if (!portfolio) return { amount: 0, percentage: 0 };
    const profit = portfolio.totalValue - portfolio.totalInvestment;
    const percentage = (profit / portfolio.totalInvestment) * 100;
    return { amount: profit, percentage };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
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
                Back to Portfolios
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const totalProfitLoss = calculateTotalProfitLoss();

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
              onClick={() => router.push('/portfolios')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Portfolios
            </button>
            <h1 className={styles.title}>{portfolio.name}</h1>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className={styles.statDetails}>
                <p className={styles.statLabel}>Total Value</p>
                <h3 className={styles.statValue}>{formatCurrency(portfolio.totalValue)}</h3>
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
                <p className={styles.statLabel}>Number of Stocks</p>
                <h3 className={styles.statValue}>{portfolio.stocks.length}</h3>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ 
                background: totalProfitLoss.amount >= 0 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={totalProfitLoss.amount >= 0 ? "23 6 13.5 15.5 8.5 10.5 1 18" : "23 18 13.5 8.5 8.5 13.5 1 6"}></polyline>
                  <polyline points={totalProfitLoss.amount >= 0 ? "17 6 23 6 23 12" : "17 18 23 18 23 12"}></polyline>
                </svg>
              </div>
              <div className={styles.statDetails}>
                <p className={styles.statLabel}>Gain/Loss</p>
                <h3 className={`${styles.statValue} ${totalProfitLoss.amount >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                  {totalProfitLoss.amount >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss.amount)}
                </h3>
                <p className={`${styles.statChange} ${totalProfitLoss.amount >= 0 ? styles.profitPositive : styles.profitNegative}`}>
                  {totalProfitLoss.percentage >= 0 ? '+' : ''}{totalProfitLoss.percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Stock List */}
          <div className={styles.stockSection}>
            <h2 className={styles.sectionTitle}>Stocks</h2>
            <div className={styles.stockList}>
              {portfolio.stocks.map((stock) => {
                const { profit, profitPercentage } = calculateProfitLoss(stock);
                const isProfit = profit >= 0;
                
                return (
                  <div key={stock.id} className={styles.stockCard}>
                    <div className={styles.stockHeader}>
                      <div className={styles.stockIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                      </div>
                      <div className={styles.stockInfo}>
                        <h3 className={styles.stockName}>{stock.name}</h3>
                        <p className={styles.stockSymbol}>{stock.symbol}</p>
                      </div>
                      <div className={`${styles.stockProfit} ${isProfit ? styles.profitPositive : styles.profitNegative}`}>
                        {isProfit ? '+' : ''}{formatCurrency(profit)}
                      </div>
                    </div>
                    
                    <div className={styles.stockDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Quantity</span>
                        <span className={styles.detailValue}>{stock.quantity}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Buy Price</span>
                        <span className={styles.detailValue}>{formatCurrency(stock.buyPrice)}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Current Price</span>
                        <span className={styles.detailValue}>{formatCurrency(stock.currentPrice)}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>P/L %</span>
                        <span className={`${styles.detailValue} ${isProfit ? styles.profitPositive : styles.profitNegative}`}>
                          {isProfit ? '+' : ''}{profitPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}