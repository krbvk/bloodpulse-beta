import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProviders } from "@/components/SessionProviders";
import { MantineProvider, ColorSchemeScript, createTheme, mantineHtmlProps } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import { SdkProvider } from "@/components/Dashboard/SdkContext";
import ClientOnly from "@/components/Loader/ClientOnly";
import { ServiceWorkerProvider } from "@/components/ServiceWorkerProvider";
import { InstallPromptProvider } from "@/components/InstallPromptProvider";
import SessionChecker from "@/components/SessionChecker";

export const metadata: Metadata = {
  title: "Bloodpulse",
  description: "Bloodpulse beta application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
});

const theme = createTheme({
  /** Put your mantine theme override here */
})


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={geist.className}>
        <MantineProvider theme={theme}>
          <SessionProviders>
            <SdkProvider>
              <ClientOnly>
                <InstallPromptProvider>
                  <SessionChecker />
                  {children}
              </InstallPromptProvider>
            </ClientOnly>
            <ServiceWorkerProvider />
            </SdkProvider>
          </SessionProviders>
        </MantineProvider>
      </body>
    </html>
  );
}
