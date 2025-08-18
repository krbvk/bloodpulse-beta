"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyPage() {
  const [countdown, setCountdown] = useState(5);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const bc = new BroadcastChannel("auth_channel");
    bc.postMessage({ type: "login-complete" });

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const openedByScript = window.opener !== null; // ✅ detect popup vs. normal tab

    if (isStandalone) {
      // ✅ Installed PWA → go straight to dashboard
      window.location.href = "/dashboard";
    } else if (openedByScript) {
      // ✅ Popup flow → try auto-close with countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            window.close();
            setShowContinue(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // ✅ Normal browser tab (desktop/mobile) → do nothing, just stay here
      setShowContinue(true);
    }

    // Cleanup broadcast channel
    const t = setTimeout(() => bc.close(), 1500);
    return () => {
      clearTimeout(t);
      bc.close();
    };
  }, []);

  return (
    <main
      style={{
        maxWidth: 520,
        margin: "6rem auto",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: 12 }}>You’re now signed in</h1>
      <p>You can close this tab and return to your original one.</p>

      {/* Show countdown only in popup */}
      {countdown > 0 && !showContinue && (
        <p style={{ marginTop: 16 }}>
          Closing in <strong>{countdown}</strong>…
        </p>
      )}

      {/* Fallback button if not popup OR if close blocked */}
      {showContinue && (
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 16px",
            background: "#000",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          Continue in App
        </Link>
      )}
    </main>
  );
}
