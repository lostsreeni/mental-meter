import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { InstallPrompt } from "@/components/InstallPrompt";
import { UpdateToast } from "@/components/UpdateToast";


export const metadata: Metadata = {
  title: "MindMeter",
  description: "A genuinely thoughtful, evidence-based mood tracker.",
  manifest: "/manifest.json",
  robots: {
    index: false,
    follow: false,
  },
  appleWebApp: {
    capable: true,
    title: "MindMeter",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#475569",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("antialiased", "font-sans") }>
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className="min-h-full flex flex-col">
        <UpdateToast />
        <main className="flex-1 safe-area-inset">
          {children}
        </main>
        <InstallPrompt />
      </body>
    </html>
  );
}
