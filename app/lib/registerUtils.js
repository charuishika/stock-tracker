// app/lib/registerUtils.js - Firebase Authentication utilities for Registration

import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

/**
 * Handle Google Sign-Up with Firebase
 * @returns {Promise<Object>} Authentication result
 */
export const handleGoogleSignUp = async () => {
  try {
    // Use popup for desktop, redirect for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let result;
    if (isMobile) {
      await signInWithRedirect(auth, googleProvider);
      return { success: true, redirect: true };
    } else {
      result = await signInWithPopup(auth, googleProvider);
    }

    const user = result.user;
    
    // Check if this is a new user
    const isNewUser = result._tokenResponse?.isNewUser || false;
    
    if (isNewUser) {
      // Create user profile in Firestore
      await createUserProfile(user);
      console.log('New user profile created');
    } else {
      console.log('Existing user logged in');
    }
    
    // Store user data
    storeUserData({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });

    // Track signup event
    trackSignUpEvent('google');
    
    return {
      success: true,
      isNewUser,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    };
  } catch (error) {
    console.error('Error during Google Sign-Up:', error);
    
    let errorMessage = 'An error occurred during sign up';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'Sign up was cancelled';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Sign up was cancelled';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with this email';
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
      const isNewUser = result._tokenResponse?.isNewUser || false;
      
      if (isNewUser) {
        await createUserProfile(user);
      }
      
      storeUserData({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
      
      trackSignUpEvent('google');
      
      return { success: true, isNewUser, user };
    }
    return { success: false };
  } catch (error) {
    console.error('Error handling redirect:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Create user profile in Firestore
 */
export const createUserProfile = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    
    // Check if user profile already exists
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        portfolios: [],
        preferences: {
          theme: 'light',
          currency: 'USD',
          notifications: true
        }
      });
      
      console.log('User profile created successfully');
      return { success: true };
    } else {
      console.log('User profile already exists');
      return { success: true, exists: true };
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    // Update Firebase Auth profile
    if (updates.displayName || updates.photoURL) {
      await updateProfile(user, {
        displayName: updates.displayName,
        photoURL: updates.photoURL
      });
    }
    
    // Update Firestore profile
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('User profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if email is already registered
 */
export const checkEmailExists = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Store user data in localStorage
 */
export const storeUserData = (userData) => {
  try {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('signUpTime', new Date().toISOString());
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Store user preferences
 */
export const storeUserPreferences = async (uid, preferences) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      preferences: preferences,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    // Also store in localStorage for quick access
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    return { success: true };
  } catch (error) {
    console.error('Error storing preferences:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user preferences
 */
export const getUserPreferences = async (uid) => {
  try {
    // Try localStorage first
    const localPrefs = localStorage.getItem('userPreferences');
    if (localPrefs) {
      return JSON.parse(localPrefs);
    }
    
    // Fallback to Firestore
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const preferences = userSnap.data().preferences || {};
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      return preferences;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting preferences:', error);
    return null;
  }
};

/**
 * Track signup event for analytics
 */
export const trackSignUpEvent = (method) => {
  try {
    // Add your analytics tracking here
    // Example: Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'sign_up', {
        method: method
      });
    }
    
    console.log('Sign up event tracked:', method);
  } catch (error) {
    console.error('Error tracking signup event:', error);
  }
};

/**
 * Send welcome email (optional - requires backend)
 */
export const sendWelcomeEmail = async (email, displayName) => {
  try {
    console.log('Welcome email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};