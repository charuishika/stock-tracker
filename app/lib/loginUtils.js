'use client';

import {
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, googleProvider, db } from "./firebase";

/* =======================================================
   🔹 GOOGLE LOGIN / SIGNUP (Combined)
   Creates user in Firestore + stores localStorage
======================================================= */
export async function handleGoogleAuth() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user) return;

    // Reference to user doc
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // If new user → create Firestore document
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "",
        email: user.email || "",
        photo: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
    }

    // 🔥 ALWAYS SAVE USER DATA TO LOCAL STORAGE
    const userData = {
      uid: user.uid,
      displayName: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
    };

    localStorage.setItem("userData", JSON.stringify(userData));

    console.log("USER STORED:", userData);

    // Redirect to dashboard
    window.location.href = "/dashboard";

  } catch (error) {
    console.error("Google Auth Error:", error);
  }
}

/* =======================================================
   🔹 LOGOUT USER
======================================================= */
export async function logoutUser() {
  try {
    await signOut(auth);
    localStorage.removeItem("userData");
    window.location.href = "/";
  } catch (error) {
    console.error("Logout Error:", error);
  }
}
