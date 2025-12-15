"use client";

import React, { useState } from 'react';
import styles from './Profile.module.css';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useState as useReactState } from "react";

const Profile = () => {

  // Sidebar toggle 
  const [sidebarCollapsed, setSidebarCollapsed] = useReactState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Sample user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD"
  };

  const handleEdit = () => {
    console.log('Edit profile clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    window.location.href = '/login';
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Account deleted');
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* === Sidebar === */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* === Main Content Wrapper === */}
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        
        {/* === Navbar === */}
        <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* === Profile Content === */}
        <main className={styles.profileContainer}>

          {/* User Info - No Card Wrapper */}
          <div className={styles.userInfoCard}>
            <div className={styles.avatar}>
              {user.initials}
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>

          {/* Action Buttons - No Card Wrapper */}
          <div className={styles.actionsCard}>
            <button className={`${styles.btn} ${styles.btnEdit}`} onClick={handleEdit}>
              Edit Profile
            </button>
            <button className={`${styles.btn} ${styles.btnLogout}`} onClick={handleLogout}>
              Logout
            </button>
            <button className={`${styles.btn} ${styles.btnDelete}`} onClick={handleDeleteClick}>
              Delete Account
            </button>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className={styles.modalOverlay} onClick={handleDeleteCancel}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className={styles.modalActions}>
                  <button className={`${styles.btn} ${styles.btnCancel}`} onClick={handleDeleteCancel}>
                    Cancel
                  </button>
                  <button className={`${styles.btn} ${styles.btnDelete}`} onClick={handleDeleteConfirm}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Profile;