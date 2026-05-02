"use client"

import { useEffect, useState } from "react"

export function UpdateToast() {
  const [waiting, setWaiting] = useState(false)
  const [reg, setReg] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        setReg(registration)
        setWaiting(true)
        return
      }

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (!newWorker) return
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setReg(registration)
            setWaiting(true)
          }
        })
      })
    })
  }, [])

  function handleUpdate() {
    if (!reg?.waiting) return
    reg.waiting.postMessage({ type: "SKIP_WAITING" })
    reg.waiting.addEventListener("statechange", () => {
      if (reg.waiting === null) {
        window.location.reload()
      }
    })
    window.location.reload()
  }

  if (!waiting) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full px-4"
    >
      <div className="bg-card border border-border rounded-xl shadow-lg px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm text-foreground font-medium">Update available</p>
        <button
          type="button"
          onClick={handleUpdate}
          className="flex-none text-sm font-semibold text-primary hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Reload
        </button>
      </div>
    </div>
  )
}
