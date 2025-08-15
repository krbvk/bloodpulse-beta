"use client";

import { useEffect } from "react";

export default function VerifyPage() {
  useEffect(() => {
    const bc = new BroadcastChannel("auth_channel");
    bc.postMessage({ type: "login-complete" });
    const t = setTimeout(() => bc.close(), 1500);
    return () => {
      clearTimeout(t);
      bc.close();
    };
  }, []);

  return (
    <main style={{ maxWidth: 520, margin: "6rem auto", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
      <h1 style={{ marginBottom: 12 }}>You’re now signed in</h1>
      <p>You can close this tab and return to your original one.</p>
    </main>
  );
}
