"use client";

import { useState, useEffect } from 'react';
import { Button, Image } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDownload } from '@tabler/icons-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window));
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsReady(true); // button can now show
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // hide button on desktop or if already installed
  if (!isMobile || isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.finally(() => setDeferredPrompt(null));
      setIsReady(false); // user responded
    } else if (isIOS) {
      alert('To install the app, tap the Share button in Safari and then Add to Home Screen.');
    } else {
      alert('Open the browser menu and select Add to Home Screen to install the app.');
    }
  };

  return (
    <Button
      onClick={handleInstall}
      disabled={!isReady && !isIOS} // enable only when ready (or on iOS fallback)
      size='md'
      radius='md'
      color={isIOS ? 'blue' : 'red'}
      style={{
        width: '250px',
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        justifyContent: 'center',
      }}
      leftSection={<Image src='/favicon.ico' alt='App Icon' width={24} height={24} />}
      rightSection={<IconDownload size={18} />}
    >
      Install App
    </Button>
  );
}
