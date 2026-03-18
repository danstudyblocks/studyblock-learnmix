import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
    const res = await fetch(
      `${backendUrl}/store/products/${productId}/digital-products`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
      }
    )
    if (!res.ok) {
      return NextResponse.json({ digital_products: [] }, { status: 200 })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Digital products API error:", error)
    return NextResponse.json({ digital_products: [] }, { status: 200 })
  }
}
