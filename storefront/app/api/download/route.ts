import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

/**
 * Proxies file download from our backend so the browser gets
 * Content-Disposition: attachment and downloads instead of opening in a new tab.
 */
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url")
    const filename = req.nextUrl.searchParams.get("filename") || "download.pdf"

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    // Only allow URLs from our backend to avoid open redirect / abuse
    const allowedOrigin = BACKEND_URL.replace(/\/$/, "")
    if (!url.startsWith(allowedOrigin + "/") && url !== allowedOrigin) {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 })
    }

    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: res.status })
    }

    const blob = await res.arrayBuffer()
    const contentType = res.headers.get("content-type") || "application/pdf"

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename.replace(/"/g, '\\"')}"`,
      },
    })
  } catch (error) {
    console.error("Download proxy error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}
