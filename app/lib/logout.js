"use client";

import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export const logoutUser = async () => {
  try {
    // Firebase sign-out
    await signOut(auth);

    // Remove stored user data
    localStorage.removeItem("userData");

    // Redirect to login
    window.location.href = "/login";

  } catch (error) {
    console.error("Logout error:", error);
    alert("Something went wrong during logout!");
  }
};
