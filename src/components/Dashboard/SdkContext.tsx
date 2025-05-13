"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from "react";
import CustomLoader from "../Loader/CustomLoader";

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

interface SdkContextType {
  sdkLoaded: boolean;
  sdkFailed: boolean;
}

const SdkContext = createContext<SdkContextType | undefined>(undefined);

export const useSdkContext = () => {
  const context = useContext(SdkContext);
  if (!context) {
    throw new Error("useSdkContext must be used within a SdkProvider");
  }
  return context;
};

interface SdkProviderProps {
  children: ReactNode;
}

export const SdkProvider: FC<SdkProviderProps> = ({ children }) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkFailed, setSdkFailed] = useState(false);

  useEffect(() => {
    if (window.FB) {
      setSdkLoaded(true);
      return;
    }

    if (document.getElementById("facebook-jssdk")) return;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setSdkLoaded(true);
      if (window.FB?.XFBML) {
        window.FB.XFBML.parse();
      }
    };

    script.onerror = () => setSdkFailed(true);

    document.body.appendChild(script);
  }, []);

  if (!sdkLoaded && !sdkFailed) {
    return <CustomLoader />;
  }

  return (
    <SdkContext.Provider value={{ sdkLoaded, sdkFailed }}>
      {children}
    </SdkContext.Provider>
  );
};
