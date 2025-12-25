'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import styles from './profile.module.css';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { logoutUser } from "@/app/lib/logout";

export default function Profile() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH LOGGED-IN USER
  ========================== */
  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem('userData');
        if (!stored) {
          router.push('/');
          return;
        }

        const parsed = JSON.parse(stored);
        if (!parsed?.uid) {
          router.push('/');
          return;
        }

        // 1️⃣ Set immediate UI data
        setUserData(parsed);

        // 2️⃣ Fetch latest Firestore user
        const userRef = doc(db, 'users', parsed.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUserData(prev => ({
            ...prev,
            ...snap.data(),
          }));
        }
      } catch (err) {
        console.error('Profile load failed:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  /* =========================
     LOGOUT
  ========================== */
  const handleLogout = async () => {
    const confirm = window.confirm('Are you sure you want to logout?');
    if (!confirm) return;

    try {
      await logoutUser();
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Logout failed. Try again.');
    }
  };

  /* =========================
     HELPERS
  ========================== */
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not available';

    try {
      const date =
        typeof timestamp === 'object' && timestamp.seconds
          ? new Date(timestamp.seconds * 1000)
          : new Date(timestamp);

      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'Not available';
    }
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
              <p>Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  /* =========================
     UI
  ========================== */
  return (
    <div className={styles.pageContainer}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className={styles.content}>

          {/* PROFILE CARD */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarSection}>
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="Profile"
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {getInitials(userData.name || userData.displayName)}
                  </div>
                )}

                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>
                    {userData.name || userData.displayName || 'User'}
                  </h2>
                  <p className={styles.profileEmail}>{userData.email}</p>
                  <span className={styles.userId}>
                    UID: {userData.uid?.slice(0, 12)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* INFO GRID */}
          <div className={styles.gridContainer}>
            {/* ACCOUNT INFO */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Account Information</h3>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{userData.email}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Account Created</span>
                <span className={styles.infoValue}>
                  {formatDate(userData.createdAt)}
                </span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Auth Provider</span>
                <span className={styles.infoBadge}>Google</span>
              </div>
            </div>

            {/* SECURITY */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Security</h3>
              <br></br>
              <p className={styles.securityText}>
                Your account is secured using Google Authentication.
              </p>
              <br></br>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
