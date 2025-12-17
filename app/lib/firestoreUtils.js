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
================================================================ */

export async function createUserIfNotExists(user) {
  try {
    if (!user || !user.uid) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "User",
        email: user.email || "",
        photo: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
}

/* ===============================================================
   PORTFOLIOS COLLECTION
================================================================ */

export async function createPortfolio(userId, portfolioName) {
  try {
    if (!userId) throw new Error("User ID missing");
    if (!portfolioName || portfolioName.trim() === "")
      throw new Error("Portfolio name cannot be empty");

    const ref = await addDoc(collection(db, "portfolios"), {
      userId,
      portfolioName: portfolioName.trim(),
      createdAt: serverTimestamp(),
    });

    return {
      id: ref.id,
      success: true
    };
  } catch (err) {
    console.error("Error creating portfolio:", err);
    throw err;
  }
}

export async function getPortfolios(userId) {
  try {
    if (!userId) return [];

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

export async function deletePortfolio(portfolioId) {
  try {
    if (!portfolioId) throw new Error("Portfolio ID required");

    await deleteDoc(doc(db, "portfolios", portfolioId));

    return { success: true };
  } catch (err) {
    console.error("Error deleting portfolio:", err);
    throw err;
  }
}

/* ===============================================================
   TRANSACTIONS COLLECTION
================================================================ */

export async function addTransaction(data) {
  try {
    if (!data || !data.portfolioId)
      throw new Error("Portfolio ID is required for transaction");

    const ref = await addDoc(collection(db, "stockTransactions"), {
      ...data,
      createdAt: serverTimestamp()
    });

    return {
      id: ref.id,
      success: true
    };
  } catch (err) {
    console.error("Error adding transaction:", err);
    throw err;
  }
}

export async function getTransactions(portfolioId) {
  try {
    if (!portfolioId) return [];

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

/* 🔥 NEW: Get ALL transactions for user */
export async function getAllTransactions(userId) {
  try {
    if (!userId) return [];

    const q = query(
      collection(db, "stockTransactions"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching all transactions:", err);
    return [];
  }
}

export async function deleteTransaction(txnId) {
  try {
    if (!txnId) throw new Error("Transaction ID required");

    await deleteDoc(doc(db, "stockTransactions", txnId));

    return { success: true };
  } catch (err) {
    console.error("Error deleting transaction:", err);
    throw err;
  }
}

/* ===============================================================
   🔥 CASCADE DELETE (PORTFOLIO + TRANSACTIONS)
================================================================ */

export async function deletePortfolioCascade(portfolioId) {
  try {
    if (!portfolioId) throw new Error("Portfolio ID required");

    // 1️⃣ Get all transactions of this portfolio
    const q = query(
      collection(db, "stockTransactions"),
      where("portfolioId", "==", portfolioId)
    );

    const snapshot = await getDocs(q);

    // 2️⃣ Delete each transaction
    const deletePromises = snapshot.docs.map(d =>
      deleteDoc(doc(db, "stockTransactions", d.id))
    );

    await Promise.all(deletePromises);

    // 3️⃣ Delete portfolio
    await deleteDoc(doc(db, "portfolios", portfolioId));

    return { success: true };
  } catch (err) {
    console.error("Cascade delete failed:", err);
    throw err;
  }
}

/* ===============================================================
   PORTFOLIO STATS
================================================================ */

export async function getPortfolioStats(portfolioId) {
  try {
    const txns = await getTransactions(portfolioId);

    let totalInvestment = 0;
    let currentValue = 0;
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
  } catch (err) {
    console.error("Error calculating stats:", err);
    return {
      totalInvestment: 0,
      currentValue: 0,
      realizedPL: 0
    };
  }
}
