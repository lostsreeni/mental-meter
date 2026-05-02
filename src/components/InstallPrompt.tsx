"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua)
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua)
  return isIos && isSafari
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosPrompt, setShowIosPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isInStandaloneMode()) return

    const dismissed = sessionStorage.getItem("install-prompt-dismissed")
    if (dismissed) return

    if (isIosSafari()) {
      setShowIosPrompt(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  function handleDismiss() {
    sessionStorage.setItem("install-prompt-dismissed", "1")
    setInstallEvent(null)
    setShowIosPrompt(false)
    setDismissed(true)
  }

  async function handleInstall() {
    if (!installEvent) return
    await installEvent.prompt()
    const choice = await installEvent.userChoice
    if (choice.outcome === "accepted") {
      setInstallEvent(null)
    }
  }

  if (dismissed) return null

  if (showIosPrompt) {
    return (
      <div
        role="banner"
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
      >
        <div className="max-w-sm mx-auto bg-card border border-border rounded-2xl shadow-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground mb-1">
                Add MindMeter to your Home Screen
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tap the{" "}
                <span className="inline-flex items-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </span>{" "}
                Share button, then tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-none p-1 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Dismiss install prompt"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!installEvent) return null

  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
    >
      <div className="max-w-sm mx-auto bg-card border border-border rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">
            Install MindMeter for quick access
          </p>
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-none p-1 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Dismiss install prompt"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 min-h-10 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 min-h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
