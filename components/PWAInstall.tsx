"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "bullseye-pwa-dismissed";
const DISMISS_DAYS = 14;

function wasDismissedRecently(): boolean {
  if (typeof window === "undefined") return true;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  if (!ts) return false;
  return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
}

export default function PWAInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    if (isIOS()) {
      const t = setTimeout(() => {
        setShowIOS(true);
        setOpen(true);
      }, 1500);
      return () => {
        window.removeEventListener("beforeinstallprompt", onPrompt);
        clearTimeout(t);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      localStorage.removeItem(DISMISS_KEY);
    } else {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setDeferred(null);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md animate-slideUp">
      <div className="card surface-grad p-4 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-grad-accent text-white shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold">App installieren</div>
            {showIOS ? (
              <div className="mt-1 text-xs text-muted leading-relaxed">
                Tippe in Safari auf{" "}
                <span className="inline-flex translate-y-[2px] items-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="mx-0.5">
                    <path d="M12 3v12m0-12l-4 4m4-4l4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                und dann <b>„Zum Home-Bildschirm"</b>.
              </div>
            ) : (
              <div className="mt-1 text-xs text-muted leading-relaxed">
                Bullseye als App auf den Startbildschirm – schneller Zugriff, offline, kein Browser-Chrome.
              </div>
            )}
          </div>
          <button onClick={dismiss} aria-label="Schließen" className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-dim hover:bg-panel2 hover:text-ink">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {!showIOS && (
          <div className="mt-3 flex gap-2">
            <button onClick={install} className="btn-primary flex-1">Installieren</button>
            <button onClick={dismiss} className="btn-ghost">Später</button>
          </div>
        )}
      </div>
    </div>
  );
}
