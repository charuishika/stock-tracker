'use client';

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebase";

/* ===============================================================
   USERS COLLECTION
   Stored when a user logs in for the first time
================================================================ */

export async function createUserIfNotExists(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
    }

  } catch (err) {
    console.error("Error creating user:", err);
  }
}

/* ===============================================================
   PORTFOLIOS COLLECTION
   Each portfolio belongs to one user
================================================================ */

// CREATE portfolio
export async function createPortfolio(userId, portfolioName) {
  try {
    const ref = await addDoc(collection(db, "portfolios"), {
      userId,
      portfolioName,
      createdAt: serverTimestamp(),
    });

    return ref.id;

  } catch (err) {
    console.error("Error creating portfolio:", err);
  }
}

// GET portfolios for a user
export async function getPortfolios(userId) {
  try {
    const q = query(
      collection(db, "portfolios"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (err) {
    console.error("Error fetching portfolios:", err);
    return [];
  }
}

// DELETE portfolio
export async function deletePortfolio(portfolioId) {
  try {
    await deleteDoc(doc(db, "portfolios", portfolioId));
  } catch (err) {
    console.error("Error deleting portfolio:", err);
  }
}

/* ===============================================================
   STOCK TRANSACTIONS COLLECTION
   Tracks all buy/sell activity of each portfolio
================================================================ */

// ADD transaction
export async function addTransaction(data) {
  try {
    return await addDoc(collection(db, "stockTransactions"), {
      ...data,
      createdAt: serverTimestamp()
    });

  } catch (err) {
    console.error("Error adding transaction:", err);
  }
}

// GET transactions of a portfolio
export async function getTransactions(portfolioId) {
  try {
    const q = query(
      collection(db, "stockTransactions"),
      where("portfolioId", "==", portfolioId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

  } catch (err) {
    console.error("Error fetching transactions:", err);
    return [];
  }
}

// DELETE transaction
export async function deleteTransaction(txnId) {
  try {
    await deleteDoc(doc(db, "stockTransactions", txnId));
  } catch (err) {
    console.error("Error deleting transaction:", err);
  }
}

/* ===============================================================
   PORTFOLIO STATS
   Calculates totals for dashboard display
================================================================ */

export async function getPortfolioStats(portfolioId) {
  const txns = await getTransactions(portfolioId);

  let totalInvestment = 0;
  let currentValue = 0;   // live API prices can be added later
  let realizedPL = 0;

  txns.forEach((t) => {
    const amount = t.quantity * t.price;

    if (t.buyOrSell === "buy") {
      totalInvestment += amount;
    } else if (t.buyOrSell === "sell") {
      realizedPL += amount;
    }
  });

  return {
    totalInvestment,
    currentValue,
    realizedPL
  };
}
