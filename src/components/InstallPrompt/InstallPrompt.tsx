"use client";

import { useState } from "react";
import { Button, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDownload } from "@tabler/icons-react";
import { useInstallPrompt } from "@/components/InstallPromptProvider";

export function InstallPrompt() {
  const deferredPrompt = useInstallPrompt();
  const [isIOS] = useState(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const [isReady, setIsReady] = useState(!!deferredPrompt);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isMobile || isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.finally(() => setIsReady(false));
    } else if (isIOS) {
      alert("To install the app, tap the Share button in Safari and then Add to Home Screen.");
    } else {
      alert("Open the browser menu and select Add to Home Screen to install the app.");
    }
  };

  return (
    <Button
      onClick={handleInstall}
      disabled={!isReady && !isIOS}
      size="md"
      radius="md"
      color={isIOS ? "blue" : "red"}
      style={{
        width: "250px",
        alignSelf: "center",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        justifyContent: "center",
      }}
      leftSection={<Image src="/favicon.ico" alt="App Icon" width={24} height={24} />}
      rightSection={<IconDownload size={18} />}
    >
      Install App
    </Button>
  );
}