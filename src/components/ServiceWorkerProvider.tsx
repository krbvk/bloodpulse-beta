"use client";

import { useEffect } from "react";

export function ServiceWorkerProvider() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("✅ Service worker registered:", reg);

          if (navigator.serviceWorker.controller) {
            console.log("🔹 This page IS controlled by a service worker");
          } else {
            console.warn("⚠️ This page is NOT controlled by a service worker yet");
          }
        })
        .catch((err) => {
          console.error("❌ SW registration failed:", err);
        });
    }
  }, []);

  return null;
}
