"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const STORAGE_KEY = "learnmix-cookie-consent"

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === null) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-4 px-4 py-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 max-w-[90vw] md:max-w-xl">
      <p className="text-sm text-gray-700">
        🍪 We use cookies to improve your experience.{" "}
        <Link href="/cookie-policy" className="text-gray-900 font-medium underline hover:no-underline">
          Cookie Policy.
        </Link>
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={reject}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={accept}
          className="px-3 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
