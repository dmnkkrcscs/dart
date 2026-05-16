import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bullseye – Dart Scorer",
  description: "Die schönste, schnellste Dart-Zähl-App – für Hobby & Stammtisch.",
  manifest: "/manifest.webmanifest",
  applicationName: "Bullseye",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Bullseye" },
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="dark">
      <body className="min-h-screen bg-bg text-ink antialiased">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-4 md:pt-8">{children}</div>
      </body>
    </html>
  );
}
