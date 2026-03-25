import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import axios from "axios"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { url } = req.query

    if (!url || typeof url !== "string") {
      return res.status(400).json({ 
        success: false,
        error: "Image URL is required" 
      })
    }

    // Fetch the image from the provided URL, retry once on transient failure
    let response: any
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: 15000,
          headers: { "Accept": "image/*,*/*" },
        })
        break
      } catch (err: any) {
        if (attempt === 2) throw err
        // Brief pause before retry
        await new Promise((r) => setTimeout(r, 500))
      }
    }

    // Determine the MIME type from the response or URL
    let mimeType = (response.headers["content-type"] || "").split(";")[0].trim()

    if (!mimeType || !mimeType.startsWith("image/")) {
      // Try to infer from URL extension
      const urlLower = url.toLowerCase().split("?")[0]
      if (urlLower.endsWith(".svg")) mimeType = "image/svg+xml"
      else if (urlLower.endsWith(".webp")) mimeType = "image/webp"
      else if (urlLower.endsWith(".png")) mimeType = "image/png"
      else if (urlLower.endsWith(".jpg") || urlLower.endsWith(".jpeg")) mimeType = "image/jpeg"
      else mimeType = "image/png"
    }

    // Reject non-image responses (e.g. HTML error pages from auth-gated CDNs)
    if (!mimeType.startsWith("image/")) {
      return res.status(422).json({
        success: false,
        error: `Remote server returned non-image content (${mimeType})`,
      })
    }

    // Convert to base64
    const base64 = Buffer.from(response.data).toString("base64")
    const dataUrl = `data:${mimeType};base64,${base64}`

    res.json({
      success: true,
      dataUrl,
      mimeType,
    })
  } catch (error: any) {
    console.error("Error fetching image:", error.message, "url:", req.query.url)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch image",
    })
  }
}

