// app/lib/loginUtils.js - Firebase Authentication utilities for Login

import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

/**
 * Handle Google Sign-In with Firebase
 * @returns {Promise<Object>} Authentication result
 */
export const handleGoogleSignIn = async () => {
  try {
    // Use popup for desktop, redirect for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let result;
    if (isMobile) {
      await signInWithRedirect(auth, googleProvider);
      // The result will be handled by getRedirectResult on page load
      return { success: true, redirect: true };
    } else {
      result = await signInWithPopup(auth, googleProvider);
    }

    const user = result.user;
    
    // Update last login time
    await updateUserLoginTime(user.uid);
    
    // Store user data in localStorage for quick access
    storeUserData({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });

    console.log('Login successful:', user.email);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error('Error during Google Sign-In:', error);
    
    // Handle specific error codes
    let errorMessage = 'An error occurred during sign in';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign in was cancelled';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign in was cancelled';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Handle redirect result (for mobile devices)
 */
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      await updateUserLoginTime(user.uid);
      storeUserData({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      return { success: true, user };
    }
    return { success: false };
  } catch (error) {
    console.error('Error handling redirect:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user's last login time in Firestore
 */
const updateUserLoginTime = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      lastLogin: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating login time:', error);
  }
};

/**
 * Sign out user
 */
export const handleSignOut = async () => {
  try {
    await signOut(auth);
    clearAuthData();
    console.log('User signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        isAuthenticated: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified
        }
      });
    } else {
      callback({
        isAuthenticated: false,
        user: null
      });
    }
  });
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

/**
 * Get user data from Firestore
 */
export const getUserDataFromFirestore = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        success: true,
        data: userSnap.data()
      };
    } else {
      return {
        success: false,
        error: 'User not found'
      };
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Store user data in localStorage
 */
export const storeUserData = (userData) => {
  try {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('lastLoginTime', new Date().toISOString());
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Get stored user data from localStorage
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('userData');
  localStorage.removeItem('lastLoginTime');
  localStorage.removeItem('userPreferences');
};

/**
 * Check if user session is still valid
 */
export const validateSession = () => {
  const user = getCurrentUser();
  const userData = getUserData();
  return user !== null && userData !== null;
};