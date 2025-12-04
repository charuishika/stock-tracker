"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔐 Route Protection + Get Logged-in User
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login"); // Redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ⏳ Show Loading State While Checking Auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // 🎉 Dashboard UI After Login
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">

        {/* User Profile Photo */}
        <img 
          src={user.photoURL} 
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 shadow-md"
        />

        {/* Welcome Text */}
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">
          Welcome, {user.displayName}! 👋
        </h1>

        <p className="text-gray-700 text-lg mb-6">
          {user.email}
        </p>

        {/* Logout Button */}
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
