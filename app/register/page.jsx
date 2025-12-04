// app/register/page.jsx
"use client";

import styles from "../login/auth.module.css";  // same CSS for login + register
import { GoogleIcon, FeatureIcons } from "@/app/lib/authIcons";
import { handleGoogleSignUp } from "@/app/lib/registerUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onGoogleSignup = async () => {
    setLoading(true);
    const result = await handleGoogleSignUp();
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      alert(result.error || "Signup failed");
    }
  };

  return (
    <div className={styles.container}>
      
      {/* LEFT SECTION */}
      <div className={styles.leftSection}>
        <div className={styles.logoSection}>
          <div className={styles.featuresBadge}>📈 PORTFOLIO MANAGEMENT</div>

          <h1 className={styles.appName}>PortfoTrack</h1>
          <p className={styles.tagline}>Your personal Stock Portfolio Manager</p>
        </div>

        <ul className={styles.featuresList}>
          <li className={styles.featureItem}>
            <div className={styles.featureIcon}><FeatureIcons type="portfolio" /></div>
            <span>Create multiple portfolios</span>
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}><FeatureIcons type="track" /></div>
            <span>Track all your stock purchases</span>
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}><FeatureIcons type="transactions" /></div>
            <span>Add buy & sell transactions</span>
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}><FeatureIcons type="realtime" /></div>
            <span>Monitor real-time market values</span>
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}><FeatureIcons type="history" /></div>
            <span>View complete profit/loss history</span>
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}><FeatureIcons type="brokers" /></div>
            <span>Track across multiple brokers</span>
          </li>
        </ul>
      </div>

      {/* RIGHT SECTION – SIGNUP CARD */}
      <div className={styles.rightSection}>
        <div className={styles.authCard}>
          <h2 className={styles.cardTitle}>Create your Account</h2>
          <p className={styles.cardSubtitle}>
            Sign up using your Google account to continue
          </p>

          <button 
            className={styles.googleBtn}
            onClick={onGoogleSignup}
            disabled={loading}
          >
            <GoogleIcon />
            {loading ? "Signing up..." : "Sign up with Google"}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.switchLink}>
            <span>Already registered?</span>
            <a href="/login"> Login</a>
          </div>
        </div>
      </div>

    </div>
  );
}
