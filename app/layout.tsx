import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWAInstall from "@/components/PWAInstall";
import SiteFooter from "@/components/SiteFooter";
import AutoSync from "@/components/AutoSync";
import RestoreFromUrl from "@/components/RestoreFromUrl";
import ThemeApplier from "@/components/ThemeApplier";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bullseye – Dart Scorer",
  description: "Die schönste, schnellste Dart-Zähl-App – für Hobby & Stammtisch.",
  manifest: "/manifest.webmanifest",
  applicationName: "Bullseye",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Bullseye" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#08090c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f6f9" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`theme-dark ${inter.variable}`} suppressHydrationWarning>
      {/* Runs before first paint to avoid flash of wrong theme */}
      <script dangerouslySetInnerHTML={{__html: `(function(){try{var s=JSON.parse(localStorage.getItem('bullseye-v1')||'{}');var t=(s.state&&s.state.settings&&s.state.settings.theme)||'dark';if(t==='light'||(t==='system'&&window.matchMedia('(prefers-color-scheme:light)').matches)){document.documentElement.classList.replace('theme-dark','theme-light');}}catch(e){}})();`}}/>
      <body className="min-h-screen bg-bg text-ink antialiased font-sans">
        <ThemeApplier/>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl"/>
          <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-accent2/10 blur-3xl"/>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-28 pt-5 md:pt-10">{children}</div>
        <SiteFooter/>
        <PWAInstall/>
        <AutoSync/>
        <RestoreFromUrl/>
      </body>
    </html>
  );
}
