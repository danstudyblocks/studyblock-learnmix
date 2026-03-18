import { NextResponse } from "next/server"

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const res = await fetch(`${backendUrl}/store/templates`, {
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch templates")
    const data = await res.json()
    return NextResponse.json(data.templates ?? [])
  } catch (error) {
    console.error("Templates API error:", error)
    return NextResponse.json([], { status: 200 })
  }
}
