import React, { useState } from 'react';
import styles from './Profile.module.css';

const Profile = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Sample user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD"
  };

  const handleEdit = () => {
    console.log('Edit profile clicked');
    // Add your edit logic here
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Account deleted');
    // Add your delete logic here
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.profileContainer}>
      {/* Title Card */}
      <div className={styles.card}>
        <h1 className={styles.gradientText}>User Profile</h1>
      </div>

      {/* User Info Card */}
      <div className={styles.card}>
        <div className={styles.userInfoCard}>
          <div className={styles.avatar}>
            {user.initials}
          </div>
          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons Card */}
      <div className={styles.card}>
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
    </div>
  );
};

export default Profile;