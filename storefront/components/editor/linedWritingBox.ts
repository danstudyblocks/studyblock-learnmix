"use client"

export const LINED_WRITING_NAME_PREFIX = "lined-writing-box:"
export const MM_TO_PX = 96 / 25.4
export const TOP_PADDING_MM = 15
export type WritingGuideKind = "lines" | "grid"

export type WritingGuidePreset = {
  kind: WritingGuideKind
  spacingMm: number
}

export const isLinedWritingBox = (element: any) =>
  element?.type === "svg" &&
  typeof element?.name === "string" &&
  element.name.startsWith(LINED_WRITING_NAME_PREFIX)

export const serializeWritingGuidePreset = ({
  kind,
  spacingMm,
}: WritingGuidePreset) => `${LINED_WRITING_NAME_PREFIX}${kind}:${spacingMm}`

export const getWritingGuidePreset = (element: any): WritingGuidePreset | null => {
  if (!isLinedWritingBox(element)) {
    return null
  }

  const presetValue = element.name.slice(LINED_WRITING_NAME_PREFIX.length)

  if (!presetValue.includes(":")) {
    const spacingMm = Number.parseFloat(presetValue)
    return Number.isFinite(spacingMm)
      ? { kind: "lines", spacingMm }
      : null
  }

  const [kindValue, spacingValue] = presetValue.split(":")
  const spacingMm = Number.parseFloat(spacingValue)
  const kind = kindValue === "grid" ? "grid" : "lines"

  if (!Number.isFinite(spacingMm)) {
    return null
  }

  return { kind, spacingMm }
}

export const getLinedWritingSpacingMm = (element: any) => {
  const preset = getWritingGuidePreset(element)

  return preset?.kind === "lines" ? preset.spacingMm : null
}

export const createWritingGuideSvg = ({
  width,
  height,
  kind = "lines",
  spacingMm,
  borderSize = 2,
  cornerRadius = 18,
}: {
  width: number
  height: number
  kind?: WritingGuideKind
  spacingMm: number
  borderSize?: number
  cornerRadius?: number
}) => {
  const spacingPx = spacingMm * MM_TO_PX
  const topPaddingPx = TOP_PADDING_MM * MM_TO_PX
  const horizontalPadding = Math.max(16, width * 0.04)
  const topInset = topPaddingPx
  const bottomInset = spacingPx
  const normalizedBorderSize = Math.max(borderSize, 0)
  const halfBorder = normalizedBorderSize / 2
  const normalizedCornerRadius = Math.max(
    0,
    Math.min(cornerRadius, (width - normalizedBorderSize) / 2, (height - normalizedBorderSize) / 2)
  )

  const guides: string[] = []

  if (kind === "grid") {
    const startX = halfBorder + spacingPx
    const endX = width - halfBorder
    const startY = halfBorder + spacingPx
    const endY = height - halfBorder

    for (let x = startX; x <= endX + 0.1; x += spacingPx) {
      guides.push(
        `<line x1="${x.toFixed(2)}" y1="${halfBorder.toFixed(2)}" x2="${x.toFixed(
          2
        )}" y2="${(height - halfBorder).toFixed(
          2
        )}" stroke="#B7AD9D" stroke-width="1.1" vector-effect="non-scaling-stroke" />`
      )
    }

    for (let y = startY; y <= endY + 0.1; y += spacingPx) {
      guides.push(
        `<line x1="${halfBorder.toFixed(2)}" y1="${y.toFixed(2)}" x2="${(
          width - halfBorder
        ).toFixed(2)}" y2="${y.toFixed(
          2
        )}" stroke="#B7AD9D" stroke-width="1.1" vector-effect="non-scaling-stroke" />`
      )
    }
  } else {
    for (let y = topInset; y <= height - bottomInset; y += spacingPx) {
      guides.push(
        `<line x1="${horizontalPadding}" y1="${y.toFixed(2)}" x2="${(
          width - horizontalPadding
        ).toFixed(2)}" y2="${y.toFixed(2)}" stroke="#B7AD9D" stroke-width="1.35" vector-effect="non-scaling-stroke" />`
      )
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect x="${halfBorder.toFixed(2)}" y="${halfBorder.toFixed(
        2
      )}" width="${Math.max(width - normalizedBorderSize, 0).toFixed(
        2
      )}" height="${Math.max(height - normalizedBorderSize, 0).toFixed(
        2
      )}" rx="${normalizedCornerRadius.toFixed(2)}" ry="${normalizedCornerRadius.toFixed(2)}" fill="#FFFDFC" stroke="#D7CEC0" stroke-width="${normalizedBorderSize}" vector-effect="non-scaling-stroke" />
      ${guides.join("")}
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const createLinedBoxSvg = (options: {
  width: number
  height: number
  kind?: WritingGuideKind
  spacingMm: number
  borderSize?: number
  cornerRadius?: number
}) => createWritingGuideSvg(options)
