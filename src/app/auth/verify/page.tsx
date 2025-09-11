"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyPage() {
  const [showContinue, setShowContinue] = useState(false);
  // ✅ iOS detection
  const [isIOS] = useState(
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
  );

  useEffect(() => {
    const bc = new BroadcastChannel("auth_channel");
    bc.postMessage({ type: "login-complete" });

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const openedByScript = window.opener !== null;

    if (isStandalone) {
      window.location.href = "/dashboard";
    } else if (openedByScript) {
      // try immediate close
      window.close();
      if (isIOS) setShowContinue(true); // fallback only on iOS
    } else {
      // Normal browser tab → only iOS shows fallback
      if (isIOS) setShowContinue(true);
    }

    const t = setTimeout(() => bc.close(), 1500);
    return () => {
      clearTimeout(t);
      bc.close();
    };
  }, [isIOS]);

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

      {/* ✅ Fallback button only on iOS */}
      {showContinue && isIOS && (
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
