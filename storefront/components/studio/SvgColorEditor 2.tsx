"use client"

import { useEffect, useRef, useState } from "react"
import { fetchSvgContent } from "@/lib/data/vendor"

const SVG_COLOR_ATTRIBUTES = ["fill", "stroke", "stop-color"] as const
const SVG_STYLE_PROPERTIES = ["fill", "stroke", "stop-color", "color"] as const
const MAX_VISIBLE_COLORS = 6

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

function encodeSvgDataUrl(svgMarkup: string) {
  const bytes = new TextEncoder().encode(svgMarkup)
  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return `data:image/svg+xml;base64,${window.btoa(binary)}`
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
    if (response.ok) {
      const markup = await response.text()
      if (markup.includes("<svg")) {
        return markup
      }
    }
  } catch {
    // Fall through to backend proxy fetch for remote assets.
  }

  const fallbackResponse = await fetchSvgContent(src)
  if (!fallbackResponse.success || !fallbackResponse.dataUrl) {
    return null
  }

  return decodeSvgDataUrl(fallbackResponse.dataUrl)
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
  const elements = [documentNode.documentElement, ...Array.from(documentNode.querySelectorAll("*"))]

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
        if (SVG_STYLE_PROPERTIES.includes(property as (typeof SVG_STYLE_PROPERTIES)[number])) {
          registerColor(value)
        }
      })
    }
  })

  Array.from(documentNode.querySelectorAll("style")).forEach((styleElement) => {
    const cssText = styleElement.textContent || ""
    const matches = cssText.matchAll(/(?:fill|stroke|stop-color|color)\s*:\s*([^;}\n]+)/gi)
    for (const match of matches) {
      registerColor(match[1])
    }
  })

  return Array.from(counts.entries())
    .map(([color, count]) => ({ color, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, MAX_VISIBLE_COLORS)
}

function replaceSvgColor(svgMarkup: string, sourceColor: string, nextColor: string) {
  const documentNode = new DOMParser().parseFromString(svgMarkup, "image/svg+xml")
  const elements = [documentNode.documentElement, ...Array.from(documentNode.querySelectorAll("*"))]

  elements.forEach((element) => {
    SVG_COLOR_ATTRIBUTES.forEach((attribute) => {
      const currentValue = element.getAttribute(attribute)
      if (normalizeSvgColor(currentValue) === sourceColor) {
        element.setAttribute(attribute, nextColor)
      }
    })

    const styleValue = element.getAttribute("style")
    if (styleValue) {
      const nextDeclarations = getInlineStyleColorEntries(styleValue).map(({ property, value }) => {
        if (
          SVG_STYLE_PROPERTIES.includes(property as (typeof SVG_STYLE_PROPERTIES)[number]) &&
          normalizeSvgColor(value) === sourceColor
        ) {
          return `${property}: ${nextColor}`
        }

        return `${property}: ${value}`
      })

      element.setAttribute("style", nextDeclarations.join("; "))
    }
  })

  Array.from(documentNode.querySelectorAll("style")).forEach((styleElement) => {
    const cssText = styleElement.textContent || ""
    styleElement.textContent = cssText.replace(
      /((?:fill|stroke|stop-color|color)\s*:\s*)([^;}\n]+)/gi,
      (fullMatch, prefix, value) => {
        if (normalizeSvgColor(value) === sourceColor) {
          return `${prefix}${nextColor}`
        }

        return fullMatch
      }
    )
  })

  return new XMLSerializer().serializeToString(documentNode)
}

export default function SvgColorEditor({ element }: { element: any }) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null)
  const [palette, setPalette] = useState<SvgPaletteColor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const src = element?.src
      if (!src) {
        if (isMounted) {
          setSvgMarkup(null)
          setPalette([])
          setHasError(false)
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      setHasError(false)

      try {
        const nextMarkup = await loadSvgMarkup(src)
        if (!isMounted || !nextMarkup) {
          return
        }

        setSvgMarkup(nextMarkup)
        setPalette(extractSvgPalette(nextMarkup))
      } catch {
        if (isMounted) {
          setSvgMarkup(null)
          setPalette([])
          setHasError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [element?.src])

  if (isLoading) {
    return <div className="canvas-context-toolbar__meta">Loading SVG colors...</div>
  }

  if (hasError || !svgMarkup || palette.length === 0) {
    return null
  }

  return (
    <div className="canvas-context-toolbar__svg-editor">
      <span className="canvas-context-toolbar__meta">Colors</span>
      <div className="canvas-context-toolbar__svg-swatches">
        {palette.map(({ color }) => (
          <div key={color} className="canvas-context-toolbar__svg-swatch-wrap">
            <button
              type="button"
              className="canvas-context-toolbar__svg-swatch"
              aria-label={`Change SVG color ${color}`}
              style={{ backgroundColor: color }}
              onClick={() => inputRefs.current[color]?.click()}
            />
            <input
              ref={(node) => {
                inputRefs.current[color] = node
              }}
              className="canvas-context-toolbar__svg-color-input"
              type="color"
              value={color}
              onChange={(event) => {
                const nextColor = event.target.value
                const nextMarkup = replaceSvgColor(svgMarkup, color, nextColor)
                setSvgMarkup(nextMarkup)
                setPalette(extractSvgPalette(nextMarkup))
                element.set({ src: encodeSvgDataUrl(nextMarkup) })
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
