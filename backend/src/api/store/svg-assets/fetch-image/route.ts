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

    // Fetch the image from the provided URL
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000, // 30 second timeout
    })

    // Determine the MIME type from the response or URL
    let mimeType = response.headers["content-type"] || "image/png"
    
    // If content-type is not set, try to infer from URL
    if (!response.headers["content-type"]) {
      const urlLower = url.toLowerCase()
      if (urlLower.endsWith(".svg")) {
        mimeType = "image/svg+xml"
      } else if (urlLower.endsWith(".webp")) {
        mimeType = "image/webp"
      } else if (urlLower.endsWith(".png")) {
        mimeType = "image/png"
      } else if (urlLower.endsWith(".jpg") || urlLower.endsWith(".jpeg")) {
        mimeType = "image/jpeg"
      }
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
    console.error("Error fetching image:", error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch image",
    })
  }
}

