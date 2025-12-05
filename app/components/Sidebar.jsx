'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { logoutUser } from "@/app/lib/logout";

export default function Sidebar({ collapsed, onToggle }) {

    const router = useRouter();
    const pathname = usePathname();   // <-- Automatically detect current route

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            )
        },
        {
            id: 'portfolios',
            label: 'Portfolios',
            path: '/portfolios',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
            )
        },
        {
            id: 'transactions',
            label: 'Transactions',
            path: '/transactions',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
            )
        },
        {
            id: 'profile',
            label: 'Profile',
            path: '/profile',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        }
    ];

    const isActive = (path) => pathname === path || pathname.startsWith(path);

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>

            {/* Header */}
            <div className={styles.sidebarHeader}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                                fill="url(#gradient1)"
                                stroke="url(#gradient1)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#667EEA' }} />
                                    <stop offset="100%" style={{ stopColor: '#764BA2' }} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    {!collapsed && <span className={styles.logoText}>PortfoTrack</span>}
                </div>

                <button className={styles.toggleButton} onClick={onToggle}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {collapsed ? (
                            <polyline points="9 18 15 12 9 6"></polyline>
                        ) : (
                            <polyline points="15 18 9 12 15 6"></polyline>
                        )}
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className={styles.sidebarNav}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                        onClick={() => router.push(item.path)}
                    >
                        <div className={styles.navIcon}>{item.icon}</div>

                        {!collapsed && <span className={styles.navLabel}>{item.label}</span>}

                        {!collapsed && isActive(item.path) && (
                            <div className={styles.activeIndicator}></div>
                        )}
                    </button>
                ))}

                <div className={styles.navDivider}></div>

                {/* Logout */}
                <button className={`${styles.navItem} ${styles.logout}`} onClick={logoutUser}>
                    <div className={styles.navIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </div>
                    {!collapsed && <span className={styles.navLabel}>Logout</span>}
                </button>
            </nav>
        </aside>
    );
}
