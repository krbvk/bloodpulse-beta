"use client";

import { createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const InstallPromptContext = createContext<BeforeInstallPromptEvent | null>(null);

export const useInstallPrompt = () => useContext(InstallPromptContext);

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  return (
    <InstallPromptContext.Provider value={deferredPrompt}>
      {children}
    </InstallPromptContext.Provider>
  );
}
