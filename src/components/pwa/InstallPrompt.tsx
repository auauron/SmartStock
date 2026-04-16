import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-install-dismissed";

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Don't show if already installed (running in standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true);

    if (isStandalone) return;

    // Don't show if dismissed recently
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Detect iOS — it doesn't fire beforeinstallprompt
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    if (ios) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Install SmartStock"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl shadow-emerald-900/10">
        {/* Icon */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          <Download className="h-5 w-5 text-emerald-600" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">
            Add SmartStock to Home Screen
          </p>
          {isIOS ? (
            <p className="mt-0.5 text-xs text-gray-500">
              Tap <span className="font-medium">Share</span> then{" "}
              <span className="font-medium">Add to Home Screen</span> in Safari.
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-gray-500">
              Install for quick access, offline use, and a faster experience.
            </p>
          )}

          {/* Install button — only for non-iOS */}
          {!isIOS && (
            <button
              id="pwa-install-btn"
              onClick={handleInstall}
              className="mt-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 active:scale-95"
            >
              Install app
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          id="pwa-dismiss-btn"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="flex-shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
