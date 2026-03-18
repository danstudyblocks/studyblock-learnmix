"use client"

import { useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import Sketch from "polotno/toolbar/sketch"
import {
  DEFAULT_COLORS,
  getUsedColors,
} from "polotno/toolbar/color-picker"
import { sameColors } from "polotno/utils/svg"
import { TOOLBAR_CLOSE_POPOVERS_EVENT } from "./toolbarPopoverUtils"

const MAX_VISIBLE_COLORS = 8
const SVG_COLOR_ATTRIBUTES = ["fill", "stroke", "stop-color"] as const
const SVG_STYLE_PROPERTIES = ["fill", "stroke", "stop-color", "color"] as const

type SvgPaletteColor = {
  color: string
  count: number
}

function getCanvasContext() {
  if (typeof document === "undefined") {
    return null
  }

  const canvas = document.createElement("canvas")
  return canvas.getContext("2d")
}

function rgbChannelToHex(channel: number) {
  return channel.toString(16).padStart(2, "0")
}

function normalizeResolvedColor(resolvedValue: string) {
  const normalizedValue = resolvedValue.trim().toLowerCase()
  const rgbMatch = normalizedValue.match(
    /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?:[\s,/]+[\d.]+)?\s*\)$/
  )

  if (!rgbMatch) {
    return normalizedValue
  }

  const [, red, green, blue] = rgbMatch
  return `#${rgbChannelToHex(Number(red))}${rgbChannelToHex(Number(green))}${rgbChannelToHex(Number(blue))}`
}

function normalizeSvgColor(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const trimmedValue = value.trim()
  if (
    !trimmedValue ||
    trimmedValue === "none" ||
    trimmedValue === "transparent" ||
    trimmedValue === "currentColor" ||
    trimmedValue.startsWith("url(") ||
    trimmedValue.startsWith("var(")
  ) {
    return null
  }

  if (/^[0-9a-fA-F]{3,8}$/.test(trimmedValue)) {
    return `#${trimmedValue.toLowerCase()}`
  }

  const context = getCanvasContext()
  if (!context) {
    return trimmedValue.toLowerCase()
  }

  try {
    context.fillStyle = "#000000"
    context.fillStyle = trimmedValue
    const resolved = context.fillStyle
    return typeof resolved === "string"
      ? normalizeResolvedColor(resolved)
      : trimmedValue.toLowerCase()
  } catch {
    return trimmedValue.toLowerCase()
  }
}

function decodeSvgDataUrl(dataUrl: string) {
  const [, rawPayload = ""] = dataUrl.split(",", 2)

  if (dataUrl.includes(";base64,")) {
    const binary = window.atob(rawPayload)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }

  return decodeURIComponent(rawPayload)
}

async function loadSvgMarkup(src: string) {
  if (!src) {
    return null
  }

  if (src.startsWith("data:image/svg+xml")) {
    return decodeSvgDataUrl(src)
  }

  try {
    const response = await fetch(src)
    if (!response.ok) {
      return null
    }

    const markup = await response.text()
    return markup.includes("<svg") ? markup : null
  } catch {
    return null
  }
}

function getInlineStyleColorEntries(styleValue: string) {
  return styleValue
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separatorIndex = declaration.indexOf(":")
      if (separatorIndex === -1) {
        return null
      }

      const property = declaration.slice(0, separatorIndex).trim().toLowerCase()
      const value = declaration.slice(separatorIndex + 1).trim()
      return { property, value }
    })
    .filter(
      (
        entry
      ): entry is {
        property: string
        value: string
      } => Boolean(entry)
    )
}

function extractSvgPalette(svgMarkup: string) {
  const documentNode = new DOMParser().parseFromString(svgMarkup, "image/svg+xml")
  const counts = new Map<string, number>()
  const elements = [
    documentNode.documentElement,
    ...Array.from(documentNode.querySelectorAll("*")),
  ]

  const registerColor = (value: string | null | undefined) => {
    const normalized = normalizeSvgColor(value)
    if (!normalized) {
      return
    }

    counts.set(normalized, (counts.get(normalized) || 0) + 1)
  }

  elements.forEach((element) => {
    SVG_COLOR_ATTRIBUTES.forEach((attribute) => {
      registerColor(element.getAttribute(attribute))
    })

    const styleValue = element.getAttribute("style")
    if (styleValue) {
      getInlineStyleColorEntries(styleValue).forEach(({ property, value }) => {
        if (
          SVG_STYLE_PROPERTIES.includes(
            property as (typeof SVG_STYLE_PROPERTIES)[number]
          )
        ) {
          registerColor(value)
        }
      })
    }
  })

  Array.from(documentNode.querySelectorAll("style")).forEach((styleElement) => {
    const cssText = styleElement.textContent || ""
    const matches = cssText.matchAll(
      /(?:fill|stroke|stop-color|color)\s*:\s*([^;}\n]+)/gi
    )
    for (const match of matches) {
      registerColor(match[1])
    }
  })

  return Array.from(counts.entries())
    .map(([color, count]) => ({ color, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, MAX_VISIBLE_COLORS)
}

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

function getCurrentSvgColor(colorsReplace: Map<string, string>, color: string) {
  if (!colorsReplace) {
    return color
  }

  const matchingKey = Array.from(colorsReplace.keys()).find((key) =>
    sameColors(key, color)
  )

  return normalizeSvgColor(colorsReplace.get(matchingKey || "") || color) || color
}

const SvgColorEditor = observer(
  ({ element, store }: { element: any; store: any }) => {
    const [palette, setPalette] = useState<SvgPaletteColor[]>([])
    const [activeColor, setActiveColor] = useState<string | null>(null)

    const presetColors = useMemo(() => {
      return Array.from(new Set([...getUsedColors(store), ...DEFAULT_COLORS]))
    }, [store])

    useEffect(() => {
      let isMounted = true

      const load = async () => {
        const src = element?.src
        if (!src) {
          if (isMounted) {
            setPalette([])
            setActiveColor(null)
          }
          return
        }

        const markup = await loadSvgMarkup(src)
        if (!isMounted || !markup) {
          if (isMounted) {
            setPalette([])
            setActiveColor(null)
          }
          return
        }

        const nextPalette = extractSvgPalette(markup)
        const replaceKeys = Array.from(element?.colorsReplace?.keys?.() || [])
          .map((color) => normalizeSvgColor(color))
          .filter(Boolean)
          .map((color) => ({ color: color as string, count: 0 }))

        const mergedPalette = [...nextPalette]
        replaceKeys.forEach((replacementColor) => {
          if (!mergedPalette.some((entry) => sameColors(entry.color, replacementColor.color))) {
            mergedPalette.push(replacementColor)
          }
        })

        if (isMounted) {
          setPalette(mergedPalette.slice(0, MAX_VISIBLE_COLORS))
        }
      }

      load()

      return () => {
        isMounted = false
      }
    }, [element?.src, element?.colorsReplace])

    useEffect(() => {
      if (!palette.length) {
        setActiveColor(null)
        return
      }

      if (!activeColor || !palette.some(({ color }) => sameColors(color, activeColor))) {
        setActiveColor(palette[0].color)
      }
    }, [activeColor, palette])

    useEffect(() => {
      const handleCloseAll = () => {
        setActiveColor(null)
      }

      document.addEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)

      return () => {
        document.removeEventListener(TOOLBAR_CLOSE_POPOVERS_EVENT, handleCloseAll)
      }
    }, [])

    if (!element || element.maskSrc || palette.length === 0) {
      return null
    }

    return (
      <div className="svg-colour-editor">
        <div className="svg-colour-editor__meta">Colours</div>
        <div className="svg-colour-editor__swatches">
          {palette.map(({ color }) => {
            const displayColor = getCurrentSvgColor(element.colorsReplace, color)
            const isActive = Boolean(activeColor && sameColors(activeColor, color))

            return (
              <button
                key={color}
                type="button"
                className={`svg-colour-editor__swatch${
                  isActive ? " svg-colour-editor__swatch--active" : ""
                }`}
                aria-label={`Edit SVG colour ${displayColor}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setActiveColor(color)
                }}
              >
                <span
                  className="svg-colour-editor__swatch-fill"
                  style={{ backgroundColor: displayColor }}
                />
              </button>
            )
          })}
        </div>
        {activeColor ? (
          <div className="svg-colour-editor__panel">
            <Sketch
              color={getCurrentSvgColor(element.colorsReplace, activeColor)}
              presetColors={presetColors}
              onChange={(nextColor: any) => {
                const sourceColor =
                  palette.find(({ color }) => sameColors(color, activeColor))?.color || activeColor

                element.replaceColor(sourceColor, formatPickerColor(nextColor))
              }}
            />
          </div>
        ) : null}
      </div>
    )
  }
)

export default SvgColorEditor
