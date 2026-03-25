"use client"

import { observer } from "mobx-react-lite"
import { useState, useRef, useEffect } from "react"
import {
  getFontsList,
  globalFonts,
  injectGoogleFont,
  injectCustomFont,
  setGoogleFonts,
  type FONT,
} from "polotno/utils/fonts"
import { getGoogleFontsListAPI } from "polotno/utils/api"

// ---------------------------------------------------------------------------
// Slider CSS
// ---------------------------------------------------------------------------
const SliderStyles = () => (
  <style>{`
    .text-props-slider {
      -webkit-appearance: none;
      appearance: none;
      height: 4px;
      border-radius: 9999px;
      background: #e8e2d8;
      outline: none;
      cursor: pointer;
      width: 100%;
    }
    .text-props-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #7b5cff;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.18);
      cursor: pointer;
      transition: transform 0.1s;
    }
    .text-props-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
    .text-props-slider::-moz-range-thumb {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #7b5cff;
      border: 2px solid white;
      box-shadow: 0 1px 4px rgba(0,0,0,0.18);
      cursor: pointer;
    }
  `}</style>
)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7f7668]">
      {label}
    </p>
    {children}
  </div>
)

function loadFont(name: string, font: FONT | null) {
  try {
    if (font) injectCustomFont(font)
    else injectGoogleFont(name)
  } catch { /* silent — font may already be injected */ }
}

// One-time loader — fetches the full Google Fonts catalogue and populates
// Polotno's observable list. Runs once per page load.
let _fontsLoaded = false
async function ensureFullFontsList() {
  if (_fontsLoaded || getFontsList().length > 20) {
    _fontsLoaded = true
    return
  }
  try {
    const apiUrl = getGoogleFontsListAPI()
    const res = await fetch(apiUrl)
    if (!res.ok) return
    const data = await res.json()
    // Polotno returns the list directly as string[] or as { items: [{family}] }
    const fonts: string[] = Array.isArray(data)
      ? data
      : (data.items ?? []).map((f: any) => String(f.family ?? f))
    if (fonts.length > 0) {
      setGoogleFonts(fonts)
      _fontsLoaded = true
    }
  } catch { /* keep default list on network error */ }
}

// ---------------------------------------------------------------------------
// Font picker dropdown
// ---------------------------------------------------------------------------
const FontPicker = observer(({
  currentFont,
  onSelect,
}: {
  currentFont: string
  onSelect: (name: string, font: FONT | null) => void
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [fontsReady, setFontsReady] = useState(getFontsList().length > 20)
  const wrapRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Fetch full fonts list once on mount
  useEffect(() => {
    ensureFullFontsList().then(() => setFontsReady(true))
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Focus search when opening
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30)
  }, [open])

  const googleList = getFontsList() as string[]
  const customList = globalFonts as FONT[]

  const q = search.toLowerCase()
  const filteredCustom = customList.filter((f) => f.fontFamily.toLowerCase().includes(q))
  const filteredGoogle = googleList.filter((name) => name.toLowerCase().includes(q))

  const totalShown = filteredCustom.length + filteredGoogle.length

  const handleSelect = (name: string, font: FONT | null) => {
    loadFont(name, font)
    onSelect(name, font)
    setOpen(false)
    setSearch("")
  }

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm text-left transition
          ${open
            ? "border-[#7b5cff] bg-white ring-2 ring-[#7b5cff]/20"
            : "border-[#d4ccbf] bg-white hover:border-[#a39b8e]"
          }`}
      >
        <span
          className="truncate font-medium text-[#171717]"
          style={{ fontFamily: `'${currentFont}', sans-serif` }}
        >
          {currentFont}
        </span>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-[#7f7668] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[#d4ccbf] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
          {/* Search */}
          <div className="border-b border-[#ede8e0] px-3 py-2.5">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a39b8e]"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search fonts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-[#f7f4f0] py-1.5 pl-7 pr-2 text-xs text-[#171717] outline-none placeholder:text-[#b0a89e]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a39b8e] hover:text-[#5d5549]"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="h-[340px] overflow-y-auto overscroll-contain">
            {/* Loading state */}
            {!fontsReady && (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-[#a39b8e]">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#e8e2d8] border-t-[#7b5cff]" />
                Loading fonts…
              </div>
            )}

            {fontsReady && totalShown === 0 && (
              <p className="px-4 py-6 text-center text-xs text-[#a39b8e]">No fonts match "{search}"</p>
            )}

            {/* Custom fonts section */}
            {fontsReady && filteredCustom.length > 0 && (
              <>
                <div className="sticky top-0 bg-white px-3 py-1.5">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a39b8e]">Custom</span>
                </div>
                {filteredCustom.map((f) => (
                  <FontRow
                    key={f.fontFamily}
                    name={f.fontFamily}
                    font={f}
                    active={currentFont === f.fontFamily}
                    onHover={() => loadFont(f.fontFamily, f)}
                    onSelect={() => handleSelect(f.fontFamily, f)}
                  />
                ))}
              </>
            )}

            {/* Google fonts section */}
            {fontsReady && filteredGoogle.length > 0 && (
              <>
                {filteredCustom.length > 0 && (
                  <div className="sticky top-0 bg-white px-3 py-1.5">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#a39b8e]">Google Fonts</span>
                  </div>
                )}
                {filteredGoogle.map((name) => (
                  <FontRow
                    key={name}
                    name={name}
                    font={null}
                    active={currentFont === name}
                    onHover={() => loadFont(name, null)}
                    onSelect={() => handleSelect(name, null)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

const FontRow = ({
  name, font, active, onHover, onSelect,
}: {
  name: string
  font: FONT | null
  active: boolean
  onHover: () => void
  onSelect: () => void
}) => {
  const [loaded, setLoaded] = useState(false)

  const handleHover = () => {
    onHover()
    // Small delay so font has a moment to parse before re-render
    setTimeout(() => setLoaded(true), 120)
  }

  return (
    <button
      type="button"
      onMouseEnter={handleHover}
      onClick={onSelect}
      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition
        ${active
          ? "bg-[#ede8ff] text-[#7b5cff]"
          : "text-[#2f2a24] hover:bg-[#f7f4f0]"
        }`}
    >
      <span style={loaded ? { fontFamily: `'${name}', sans-serif` } : undefined}>
        {name}
      </span>
      {active && (
        <svg className="h-3.5 w-3.5 flex-shrink-0 text-[#7b5cff]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------
export const TextPropertiesPanel = observer(({ store }: { store: any }) => {
  const selected = store.selectedElements?.[0]
  const isText = selected?.type === "text"

  if (!isText) return null

  const fontSize = Math.round(Number(selected.fontSize) || 16)
  const fontFamily: string = selected.fontFamily || "Roboto"

  const setFontSize = (raw: number) => {
    const val = Math.max(4, Math.min(400, isNaN(raw) ? fontSize : raw))
    selected.set({ fontSize: val })
  }

  const applyFont = (name: string) => {
    selected.set({ fontFamily: name })
  }

  return (
    <div className="flex w-[200px] min-w-[200px] flex-col border-l border-[#d8d2c8] bg-[#fcfaf8]">
      <SliderStyles />

      {/* Header */}
      <div className="flex-shrink-0 border-b border-[#d8d2c8] px-5 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7f7668]">Selected</p>
        <h3 className="mt-1.5 text-base font-semibold leading-tight text-[#171717]">Text</h3>
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-visible px-5 py-5 space-y-5">

        {/* Font family picker */}
        <Row label="Font">
          <FontPicker
            currentFont={fontFamily}
            onSelect={(name) => applyFont(name)}
          />
        </Row>

        {/* Font size */}
        <Row label="Size">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              min={4} max={400}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              onBlur={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full rounded-xl border border-[#d4ccbf] bg-white px-3 py-2.5 text-center text-sm font-semibold text-[#171717] outline-none transition focus:border-[#7b5cff] focus:ring-2 focus:ring-[#7b5cff]/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="shrink-0 text-xs text-[#a39b8e]">px</span>
          </div>
          <input
            type="range"
            className="text-props-slider"
            min={4} max={200} step={1}
            value={Math.min(fontSize, 200)}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
          />
          <div className="mt-1.5 flex justify-between">
            <span className="text-[10px] text-[#b8b0a6]">4</span>
            <span className="text-[10px] text-[#b8b0a6]">100</span>
            <span className="text-[10px] text-[#b8b0a6]">200</span>
          </div>
        </Row>

        {/* Quick-pick sizes */}
        <Row label="Quick sizes">
          <div className="grid grid-cols-3 gap-1.5">
            {[10, 12, 14, 18, 24, 32, 40, 56, 72].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`rounded-lg border py-1.5 text-xs font-semibold transition
                  ${fontSize === size
                    ? "border-[#7b5cff] bg-[#ede8ff] text-[#7b5cff]"
                    : "border-[#d4ccbf] bg-white text-[#5d5549] hover:border-[#7b5cff] hover:text-[#7b5cff]"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </Row>
      </div>
    </div>
  )
})
