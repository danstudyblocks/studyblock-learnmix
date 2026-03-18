"use client"

import { useEffect, useMemo, useState } from "react"
import Sketch from "polotno/toolbar/sketch"
import {
  DEFAULT_COLORS,
  getUsedColors,
} from "polotno/toolbar/color-picker"
import {
  closeToolbarPopovers,
  TOOLBAR_CLOSE_POPOVERS_EVENT,
} from "./toolbarPopoverUtils"

function formatPickerColor(nextColor: any) {
  if (typeof nextColor === "string") {
    return nextColor
  }

  if (nextColor?.rgb) {
    const { r, g, b, a } = nextColor.rgb
    if (typeof a === "number" && a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }
  }

  return nextColor?.hex || "#000000"
}

export default function InlineColorPickerField({
  value,
  onChange,
  store,
  ariaLabel = "Pick color",
}: {
  value: string
  onChange: (color: string) => void
  store: any
  ariaLabel?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = useMemo(() => {
    return Array.from(new Set([...getUsedColors(store), ...DEFAULT_COLORS]))
  }, [store])

  useEffect(() => {
    const handleCloseAll = () => {
      setIsOpen(false)
    }

    document.addEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)

    return () => {
      document.removeEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)
    }
  }, [])

  return (
    <div
      className={`inline-color-field${isOpen ? " inline-color-field--open" : ""}`}
    >
      <button
        type="button"
        className="inline-color-field__trigger"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()

          if (isOpen) {
            setIsOpen(false)
            return
          }

          closeToolbarPopovers(event.currentTarget)
          window.setTimeout(() => {
            setIsOpen(true)
          }, 0)
        }}
      >
        <span
          className="inline-color-field__swatch"
          style={{ backgroundColor: value }}
        />
      </button>
      {isOpen ? (
        <div className="inline-color-field__panel">
          <Sketch
            color={value}
            presetColors={presetColors}
            onChange={(nextColor: any) => onChange(formatPickerColor(nextColor))}
          />
        </div>
      ) : null}
    </div>
  )
}
