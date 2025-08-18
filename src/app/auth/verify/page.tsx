"use client";

import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const bc = new BroadcastChannel("auth_channel");
    bc.postMessage({ type: "login-complete" });

    if (window.matchMedia("(display-mode: standalone)").matches) {
      window.location.href = "/dashboard";
    } else {
      setTimeout(() => setShowContinue(true), 1000);
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

      {showContinue && (
        <a
          href="/dashboard"
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
        </a>
      )}
    </main>
  );
}
