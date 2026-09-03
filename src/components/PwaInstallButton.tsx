import { useEffect, useState } from "react";
import { Download, Share, X, Laptop } from "lucide-react";
import { createPortal } from "react-dom";

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [showDesktopFallback, setShowDesktopFallback] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    setIsInstalled(isInStandalone);
    if (isInStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }
    if (!deferredPrompt) {
      // Fallback if browser didn't fire event (e.g. Safari, Firefox, or Local Dev without SW)
      setShowDesktopFallback(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        title="Install Mailcoy App"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[11.5px] font-bold shadow-sm transition cursor-pointer"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>

      {/* iOS Instructions Modal */}
      {showIosInstructions && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-line rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Install on iOS</h3>
              <button
                type="button"
                onClick={() => setShowIosInstructions(false)}
                className="p-1 rounded-md text-ink-3 hover:text-ink transition bg-ink/[0.04]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-ink-2 mb-4 leading-relaxed">
              To install Mailcoy Compose on your iPhone or iPad:
            </p>
            <ol className="text-sm text-ink-2 space-y-3 list-decimal list-inside">
              <li>
                Tap the <Share className="inline h-4 w-4 text-emerald-500 mx-1" /> <strong>Share</strong> button in Safari's bottom menu bar.
              </li>
              <li>
                Scroll down and select <strong>"Add to Home Screen"</strong>.
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIosInstructions(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Desktop / Unsupported Browser Fallback Modal */}
      {showDesktopFallback && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-line rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center">
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink mb-1">Manual Install Required</h3>
                <p className="text-sm text-ink-2 leading-relaxed">
                  Your current browser (or local dev environment) doesn't support automatic installation. 
                  <br className="my-2" />
                  Look for an <strong>Install icon</strong> in your URL bar, or open your browser's menu (⋮) and select <strong>Install App</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDesktopFallback(false)}
                className="w-full py-2.5 rounded-xl bg-ink text-background font-semibold text-sm transition cursor-pointer"
              >
                Okay, I'll check my browser
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
