"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyPage() {
  const [countdown, setCountdown] = useState(5);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const bc = new BroadcastChannel("auth_channel");
    bc.postMessage({ type: "login-complete" });

    if (window.matchMedia("(display-mode: standalone)").matches) {
      // ✅ Inside installed app → redirect immediately
      window.location.href = "/dashboard";
    } else {
      // ✅ Browser → show countdown + try closing
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);

            // Try closing tab (only works if opened by script)
            window.close();

            // If blocked, show button
            setShowContinue(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }

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

      {countdown > 0 && (
        <p style={{ marginTop: 16 }}>
          Automatically closing in <strong>{countdown}</strong>…
        </p>
      )}

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
