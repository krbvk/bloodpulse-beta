"use client";

import React, { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';

interface SdkContextType {
  sdkLoaded: boolean;
  sdkFailed: boolean;
  setSdkLoaded: (loaded: boolean) => void;
  setSdkFailed: (failed: boolean) => void;
}

const SdkContext = createContext<SdkContextType | undefined>(undefined);

export const useSdkContext = () => {
  const context = useContext(SdkContext);
  if (!context) {
    throw new Error('useSdkContext must be used within a SdkProvider');
  }
  return context;
};

interface SdkProviderProps {
  children: ReactNode;
}

export const SdkProvider: React.FC<SdkProviderProps> = ({ children }) => {
  const [sdkLoaded, setSdkLoaded] = useState<boolean>(false);
  const [sdkFailed, setSdkFailed] = useState<boolean>(false);

  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) return;

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;

    script.onload = () => setSdkLoaded(true);
    script.onerror = () => setSdkFailed(true);

    document.body.appendChild(script);
  }, []);

  return (
    <SdkContext.Provider value={{ sdkLoaded, sdkFailed, setSdkLoaded, setSdkFailed }}>
      {children}
    </SdkContext.Provider>
  );
};
