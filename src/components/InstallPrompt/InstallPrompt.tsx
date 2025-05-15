import { useState, useEffect } from 'react';
import { Button, Image, Notification, Stack } from '@mantine/core';
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
  const [showiOSInstruction, setShowiOSInstruction] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.finally(() => setDeferredPrompt(null));
    }
  };

  return (
    <div>
      {!isIOS ? (
        <Button
          onClick={handleInstall}
          size={isMobile ? 'md' : 'lg'}
          radius="md"
          color="red"
          style={{
            width: isMobile ? '250px' : 'fit-content',
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            justifyContent: 'center',
          }}
          leftSection={<Image src="/favicon.ico" alt="App Icon" width={24} height={24} />}
          rightSection={<IconDownload size={18} />}
        >
          Install App
        </Button>
      ) : (
        <>
          <Button
            onClick={() => setShowiOSInstruction(true)}
            size={isMobile ? 'md' : 'lg'}
            radius="md"
            color="blue"
            style={{
              width: isMobile ? '250px' : 'fit-content',
              alignSelf: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              justifyContent: 'center',
            }}
            leftSection={<Image src="/favicon.ico" alt="App Icon" width={24} height={24} />}
            rightSection={<IconDownload size={18} />}
          >
            Install App
          </Button>

          {showiOSInstruction && (
            <Notification
              title="Add to Home Screen"
              color="blue"
              onClose={() => setShowiOSInstruction(false)}
              style={{ 
                width: isMobile ? '100%' : '250px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999, 
                position: 'fixed',
                top: '4rem'
              }}
            >
              To install the app, tap the <strong>Share</strong> button in Safari, scroll down, and tap <strong>“Add to Home Screen”</strong>.
            </Notification>
          )}
        </>
      )}
    </div>
  );
}
