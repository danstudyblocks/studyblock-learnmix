import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { createOAuthHeader } from "../oauth"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const apiKey = process.env.NOUN_PROJECT_API_KEY
  const apiSecret = process.env.NOUN_PROJECT_API_SECRET

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ success: false, error: "Noun Project API credentials not configured" })
  }

  const { id } = req.query as Record<string, string>
  if (!id) {
    return res.status(400).json({ success: false, error: "Icon id is required" })
  }

  try {
    // Fetch icon metadata to get the SVG CDN URL
    const metaUrl = `https://api.thenounproject.com/v2/icon/${id}`
    const authHeader = createOAuthHeader("GET", metaUrl, apiKey, apiSecret)

    const metaRes = await fetch(metaUrl, {
      headers: { Authorization: authHeader, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    })

    if (!metaRes.ok) {
      return res.status(metaRes.status).json({ success: false, error: `Icon metadata fetch failed: ${metaRes.status}` })
    }

    const meta = await metaRes.json() as any
    const icon = meta.icon || meta

    // Prefer SVG URL, fall back to PNG
    const svgUrl: string = icon.icon_url || icon.preview_url || icon.thumbnail_url

    if (!svgUrl) {
      return res.status(404).json({ success: false, error: "No downloadable URL found for this icon" })
    }

    // Fetch the actual image content
    const imgRes = await fetch(svgUrl, { signal: AbortSignal.timeout(15000) })
    if (!imgRes.ok) {
      return res.status(imgRes.status).json({ success: false, error: `Failed to fetch icon file: ${imgRes.status}` })
    }

    let mimeType = (imgRes.headers.get("content-type") || "").split(";")[0].trim()
    if (!mimeType.startsWith("image/")) {
      // Infer from URL
      const urlLower = svgUrl.toLowerCase().split("?")[0]
      if (urlLower.endsWith(".svg")) mimeType = "image/svg+xml"
      else if (urlLower.endsWith(".png")) mimeType = "image/png"
      else mimeType = "image/svg+xml"
    }

    const buffer = await imgRes.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    return res.json({
      success: true,
      dataUrl: `data:${mimeType};base64,${base64}`,
      mimeType,
    })
  } catch (err: any) {
    console.error("Noun Project icon fetch failed:", err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
}
