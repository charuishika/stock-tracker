'use client';

import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ onMenuClick }) {
    const [userData, setUserData] = useState({
        displayName: 'User',
        email: 'user@example.com',
        photoURL: null
    });

    // --- Load user data from localStorage ---
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('userData');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                setUserData({
                    displayName: parsed.displayName || parsed.name || 'User',
                    email: parsed.email || 'user@example.com',
                    photoURL: parsed.photoURL || parsed.photo || null
                });
            }
        } catch (error) {
            console.error('Error reading user data from localStorage:', error);
        }
    }, []);

    // --- Utility to generate initials ---
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // --- Handle broken Google image URLs gracefully ---
    const handleImageError = (e) => {
        e.target.style.display = "none"; // hide broken image
        e.target.parentNode.querySelector(`.${styles.avatarPlaceholder}`).style.display = "flex";
    };

    return (
        <header className={styles.navbar}>
            <div className={styles.navbarLeft}>
                <button className={styles.mobileMenuBtn} onClick={onMenuClick}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <div className={styles.greeting}>
                    <h1 className={styles.greetingText}>Hi, {userData.displayName} 👋</h1>
                    <p className={styles.greetingSubtext}>Welcome back to your dashboard</p>
                </div>
            </div>

            <div className={styles.navbarRight}>
                
                {/* Notifications */}
                <button className={styles.iconButton}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span className={styles.badge}>3</span>
                </button>

                {/* Settings */}
                <button className={styles.iconButton}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6m0 6v6m5.196-13.804l-4.242 4.242m0 4.242l4.242 4.242M1 12h6m6 0h6m-13.804 5.196l4.242-4.242m0-4.242l-4.242-4.242"></path>
                    </svg>
                </button>

                {/* User Profile */}
                <div className={styles.userProfile}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{userData.displayName}</span>
                        <span className={styles.userEmail}>{userData.email}</span>
                    </div>

                    <div className={styles.userAvatar}>
                        {userData.photoURL ? (
                            <>
                                <img
                                    src={`${userData.photoURL}&t=${Date.now()}`}
                                    alt={userData.displayName}
                                    className={styles.avatarImg}
                                    onError={handleImageError}
                                />
                                <div className={styles.avatarPlaceholder} style={{ display: "none" }}>
                                    {getInitials(userData.displayName)}
                                </div>
                            </>
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {getInitials(userData.displayName)}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
}
