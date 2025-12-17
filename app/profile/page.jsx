"use client";

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch user data...');
        
        // Check if we're in the browser
        if (typeof window === 'undefined') {
          console.log('Not in browser yet');
          return;
        }

        // Get user ID and token from localStorage
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');
        
        console.log('userId:', userId);
        console.log('token:', token ? 'exists' : 'missing');
        
        if (!userId || !token) {
          // If no auth, try to use localStorage data directly
          const storedData = localStorage.getItem('userData');
          console.log('No auth found, checking stored data:', storedData);
          
          if (storedData) {
            const parsed = JSON.parse(storedData);
            setUserData({
              name: parsed.displayName || parsed.name || 'User',
              email: parsed.email || 'user@example.com',
              photoURL: parsed.photoURL || parsed.photo
            });
            setLoading(false);
            return;
          }
          
          // Set demo data if nothing exists
          console.log('Setting demo data');
          setUserData({
            name: 'Demo User',
            email: 'demo@example.com',
            photoURL: null
          });
          setLoading(false);
          return;
        }

        // Try to fetch from API
        console.log('Fetching from API...');
        const response = await fetch(`/api/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API data received:', data);
        
        setUserData({
          id: data.id,
          name: data.name || data.displayName,
          email: data.email,
          photoURL: data.photoURL || data.photo,
          createdAt: data.createdAt,
        });

        // Update localStorage
        localStorage.setItem('userData', JSON.stringify({
          displayName: data.name || data.displayName,
          email: data.email,
          photoURL: data.photoURL || data.photo
        }));

        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        
        // Fallback to localStorage
        try {
          const storedData = localStorage.getItem('userData');
          if (storedData) {
            const parsed = JSON.parse(storedData);
            setUserData({
              name: parsed.displayName || parsed.name || 'User',
              email: parsed.email || 'user@example.com',
              photoURL: parsed.photoURL || parsed.photo
            });
          } else {
            // Set demo data
            setUserData({
              name: 'Demo User',
              email: 'demo@example.com',
              photoURL: null
            });
          }
        } catch (localError) {
          console.error('Error with localStorage:', localError);
          setUserData({
            name: 'Demo User',
            email: 'demo@example.com',
            photoURL: null
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleEdit = () => {
    alert('Edit profile - integrate with your form/modal');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');

      if (userId && token) {
        const response = await fetch(`/api/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }
      }

      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Failed to delete account. Please try again.');
    }
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={{margin: 0, color: '#64748b'}}>Loading profile...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Main render
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>💼 Portfolio App</h2>
        </div>
        <nav style={styles.nav}>
          <a href="/dashboard" style={styles.navItem}>📊 Dashboard</a>
          <a href="/portfolios" style={styles.navItem}>📁 My Portfolios</a>
          <a href="/transactions" style={styles.navItem}>💳 Transactions</a>
          <a href="/profile" style={{...styles.navItem, ...styles.navItemActive}}>👤 Profile</a>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Navbar */}
        <header style={styles.navbar}>
          <div style={styles.navbarLeft}>
            <h1 style={styles.pageTitle}>Profile</h1>
            <p style={styles.subtitle}>Hi {userData?.name || 'User'}, welcome back 👋</p>
          </div>
        </header>

        {/* Profile Container */}
        <main style={styles.profileContainer}>
          {/* Error Message (if any) */}
          {error && (
            <div style={styles.errorBanner}>
              ⚠️ Could not fetch latest data. Showing cached information.
            </div>
          )}

          {/* User Info Card */}
          <div style={styles.userInfoCard}>
            <div style={styles.avatar}>
              {userData?.photoURL ? (
                <img 
                  src={userData.photoURL} 
                  alt={userData.name}
                  style={styles.avatarImg}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span style={styles.avatarInitials}>
                  {getInitials(userData?.name)}
                </span>
              )}
            </div>
            <div style={styles.userDetails}>
              <h2 style={styles.userName}>{userData?.name || 'User'}</h2>
              <p style={styles.userEmail}>{userData?.email || 'email@example.com'}</p>
              {userData?.createdAt && (
                <p style={styles.memberSince}>
                  Member since {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Actions Card */}
          <div style={styles.actionsCard}>
            <button style={{...styles.btn, ...styles.btnEdit}} onClick={handleEdit}>
              ✏️ Edit Profile
            </button>
            <button style={{...styles.btn, ...styles.btnLogout}} onClick={handleLogout}>
              🚪 Logout
            </button>
            <button style={{...styles.btn, ...styles.btnDelete}} onClick={handleDeleteClick}>
              🗑️ Delete Account
            </button>
          </div>

          {/* Debug Info (Remove in production) */}
          <div style={styles.debugCard}>
            <h3 style={{margin: '0 0 12px 0', fontSize: '14px', color: '#64748b'}}>
              Debug Info (check console for more):
            </h3>
            <pre style={{fontSize: '12px', color: '#94a3b8', margin: 0, overflow: 'auto'}}>
              {JSON.stringify({
                hasUserId: !!localStorage.getItem('userId'),
                hasToken: !!localStorage.getItem('authToken'),
                hasUserData: !!localStorage.getItem('userData'),
                currentData: userData
              }, null, 2)}
            </pre>
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div style={styles.modalOverlay} onClick={handleDeleteCancel}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.modalTitle}>⚠️ Confirm Delete</h3>
                <p style={styles.modalText}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div style={styles.modalActions}>
                  <button style={{...styles.btn, ...styles.btnCancel}} onClick={handleDeleteCancel}>
                    Cancel
                  </button>
                  <button style={{...styles.btn, ...styles.btnDelete}} onClick={handleDeleteConfirm}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#1e293b',
    color: 'white',
    padding: '24px',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
  },
  sidebarHeader: {
    marginBottom: '32px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#cbd5e1',
    transition: 'all 0.2s',
    cursor: 'pointer',
    display: 'block',
  },
  navItemActive: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  mainContent: {
    flex: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: 'white',
    padding: '20px 32px',
    borderBottom: '1px solid #e5e7eb',
  },
  navbarLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '600',
    margin: 0,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  profileContainer: {
    padding: '32px',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorBanner: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  userInfoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
  },
  avatarInitials: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0 0 4px 0',
  },
  memberSince: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: 0,
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '16px',
  },
  debugCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '12px',
  },
  btn: {
    padding: '14px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  btnEdit: {
    backgroundColor: '#3b82f6',
    color: 'white',
  },
  btnLogout: {
    backgroundColor: '#64748b',
    color: 'white',
  },
  btnDelete: {
    backgroundColor: '#ef4444',
    color: 'white',
  },
  btnCancel: {
    backgroundColor: '#e5e7eb',
    color: '#1e293b',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    color: '#1e293b',
  },
  modalText: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 24px 0',
    lineHeight: '1.6',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
  },
}