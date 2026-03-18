import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import { jsPDF } from "jspdf"

const BACKEND_URL = (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/$/, "")

/** Comma-separated list of URL prefixes allowed for download (e.g. S3 bucket). */
const ALLOWED_EXTRA_BASES = (
  process.env.ALLOWED_DOWNLOAD_BASE_URLS || "https://studyblocksimages.s3"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

function isUrlAllowed(url: string): boolean {
  if (url.startsWith(BACKEND_URL + "/") || url === BACKEND_URL) return true
  return ALLOWED_EXTRA_BASES.some((base) => base && url.startsWith(base))
}

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"]

/**
 * Fetches a file from url; if it's an image, converts it to a single-page PDF
 * and returns it so the client can download without opening the original URL.
 */
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url")
    const filename = req.nextUrl.searchParams.get("filename") || "download.pdf"

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    if (!isUrlAllowed(url)) {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 })
    }

    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: res.status })
    }

    const contentType = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase()
    const buffer = Buffer.from(await res.arrayBuffer())

    if (IMAGE_TYPES.includes(contentType)) {
      const { width = 800, height = 600 } = await sharp(buffer).metadata()
      const w = Number(width) || 800
      const h = Number(height) || 600
      const base64 = buffer.toString("base64")
      const format = contentType === "image/jpeg" || contentType === "image/jpg" ? "JPEG" : "PNG"
      const dataUrl = `data:${contentType};base64,${base64}`
      const doc = new jsPDF({
        unit: "px",
        format: [w, h],
        hotfixes: ["px_scaling"],
      })
      doc.addImage(dataUrl, format, 0, 0, w, h)
      const pdfBytes = doc.output("arraybuffer")

      return new NextResponse(pdfBytes, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename.replace(/"/g, '\\"')}"`,
        },
      })
    }

    if (contentType === "application/pdf") {
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename.replace(/"/g, '\\"')}"`,
        },
      })
    }

    return NextResponse.json(
      { error: "Unsupported file type; only PDF and images are supported" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Download-as-PDF error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
