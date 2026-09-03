import React, { useState, useEffect } from "react";
import { Download, X, Share, Smartphone, PlusSquare } from "lucide-react";

const DISMISSED_KEY = "mailcoy:pwa-banner-dismissed";

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if already running in standalone mode (PWA installed)
    const isInStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isInStandalone);
    if (isInStandalone) return;

    // Check if user previously dismissed
    try {
      const dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
      if (dismissed) return;
    } catch {
      /* noop */
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      setIsDismissed(false);
    }

    // Listen for beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsDismissed(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* noop */
    }
  };

  if (isStandalone || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-surface/95 backdrop-blur-md border border-line rounded-2xl p-3.5 shadow-2xl animate-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 grid place-items-center shrink-0">
          <Smartphone className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[13px] font-bold text-ink">Install Mailcoy Compose</h4>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1 text-ink-4 hover:text-ink transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[11.5px] text-ink-3 leading-relaxed">
            {isIos ? (
              <span>
                Tap the <Share className="inline h-3.5 w-3.5 text-emerald-500 mx-0.5" /> Share icon and select{" "}
                <strong>"Add to Home Screen"</strong> for 1-tap business sending.
              </span>
            ) : (
              <span>Add to your device for instant 1-tap business emails from your home screen.</span>
            )}
          </p>

          {!isIos && deferredPrompt && (
            <div className="pt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install App</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-2 py-1 text-xs text-ink-3 hover:text-ink transition cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
