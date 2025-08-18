"use client";

import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [countdown, setCountdown] = useState(5);
  const [canAutoClose, setCanAutoClose] = useState(false);
  const [showManualMessage, setShowManualMessage] = useState(false);

  useEffect(() => {
    const bc = new BroadcastChannel("auth_channel");
    bc.postMessage({ type: "login-complete" });

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const openedByScript = window.opener !== null;

    if (isStandalone || openedByScript) {
      // ✅ Installed PWA or popup → allow auto-close
      setCanAutoClose(true);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            window.close();
            setShowManualMessage(true); // If blocked
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // ✅ Normal browser tab → cannot auto-close
      setShowManualMessage(true);
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

      {canAutoClose && countdown > 0 && (
        <p style={{ marginTop: 16 }}>
          This tab will close in <strong>{countdown}</strong>…
        </p>
      )}

      {showManualMessage && (
        <p style={{ marginTop: 20, color: "#555" }}>
          You may now safely close this tab.
        </p>
      )}
    </main>
  );
}
