import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { SessionProviders } from "@/components/SessionProviders";
import { ColorModeProvider } from "@/components/ui/color-mode";

export const metadata: Metadata = {
  title: "Bloodpulse",
  description: "Bloodpulse beta application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
      <ColorModeProvider>
        <Provider>
          <SessionProviders>{children}</SessionProviders>
        </Provider>
      </ColorModeProvider>
      </body>
    </html>
  );
}
