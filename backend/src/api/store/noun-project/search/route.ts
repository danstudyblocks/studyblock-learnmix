import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { createOAuthHeader } from "../oauth"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const apiKey = process.env.NOUN_PROJECT_API_KEY
  const apiSecret = process.env.NOUN_PROJECT_API_SECRET

  if (!apiKey || !apiSecret) {
    return res.status(500).json({
      success: false,
      error: "Noun Project API credentials are not configured",
    })
  }

  const { query = "", page = "1", limit = "40" } = req.query as Record<string, string>

  if (!query.trim()) {
    return res.json({ success: true, icons: [], total: 0 })
  }

  const url = new URL("https://api.thenounproject.com/v2/icon")
  url.searchParams.set("query", query)
  url.searchParams.set("limit", limit)
  url.searchParams.set("page", page)
  url.searchParams.set("thumbnail_size", "200")
  url.searchParams.set("include_svg", "1")

  const authHeader = createOAuthHeader("GET", url.toString(), apiKey, apiSecret)

  try {
    const response = await fetch(url.toString(), {
      headers: { Authorization: authHeader, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("Noun Project search error:", response.status, text)
      return res.status(response.status).json({
        success: false,
        error: `Noun Project API returned ${response.status}`,
      })
    }

    const data = await response.json() as any

    const icons = (data.icons || []).map((icon: any) => ({
      id: icon.id,
      name: icon.term,
      thumbnail: icon.thumbnail_url,
      preview: icon.preview_url || icon.thumbnail_url,
      svgUrl: icon.icon_url,
      attribution: icon.uploader?.name || "",
    }))

    return res.json({ success: true, icons, total: data.total || icons.length })
  } catch (err: any) {
    console.error("Noun Project search failed:", err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
}
