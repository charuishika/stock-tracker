// app/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrtFxS6Ph97tb8Nk5kEgrHavaL0rNu9f0",
  authDomain: "stock-tracker-b8ef4.firebaseapp.com",
  projectId: "stock-tracker-b8ef4",
  storageBucket: "stock-tracker-b8ef4.firebasestorage.app",
  messagingSenderId: "86509667288",
  appId: "1:86509667288:web:0ad8d7551a1e93bd39e8ad"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
