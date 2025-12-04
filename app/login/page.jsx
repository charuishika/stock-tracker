"use client";

import styles from "./auth.module.css";
import { GoogleIcon, FeatureIcons } from "@/app/lib/authIcons";
import { handleGoogleSignIn } from "@/app/lib/loginUtils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    const res = await handleGoogleSignIn();
    setLoading(false);

    if (res.success) router.push("/dashboard");
    else alert(res.error);
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
            <div className={styles.featureIcon}>
              <FeatureIcons type="portfolio" />
            </div>
            Create multiple portfolios
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FeatureIcons type="track" />
            </div>
            Track all your stock purchases
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FeatureIcons type="transactions" />
            </div>
            Add buy & sell transactions
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FeatureIcons type="realtime" />
            </div>
            Monitor real-time values
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FeatureIcons type="history" />
            </div>
            View complete profit/loss history
          </li>

          <li className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FeatureIcons type="brokers" />
            </div>
            Track across multiple brokers
          </li>
        </ul>
      </div>

      {/* RIGHT SECTION */}
      <div className={styles.rightSection}>
        <div className={styles.authCard}>
          <h2 className={styles.cardTitle}>Login to your Account</h2>
          <p className={styles.cardSubtitle}>Welcome back! Sign in to continue</p>

          <button className={styles.googleBtn} onClick={signIn}>
            <GoogleIcon />
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <div className={styles.switchLink}>
            Don't have an account?{" "}
            <a href="/register">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
