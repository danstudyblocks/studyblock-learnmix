import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sdk } from "@/lib/config"
import { getRegion } from "@/lib/data/regions"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get print order data from request body
    const printOrderData = await request.json()
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    // Get variant ID and print order data from backend
    const addToCartResponse = await fetch(
      `${backendUrl}/store/print-orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
        credentials: "include",
        body: JSON.stringify(printOrderData),
      }
    )

    if (!addToCartResponse.ok) {
      const errorText = await addToCartResponse.text()
      throw new Error(`Failed to get print order variant: ${errorText}`)
    }

    const cartData = await addToCartResponse.json()

    // Get region using the helper function (defaults to "gb" or "us")
    const countryCode = "gb" // Default country code
    let region = await getRegion(countryCode)

    if (!region) {
      // Fallback: try to get any region from the list
      const { regions } = await sdk.store.region.list()
      if (!regions || regions.length === 0) {
        throw new Error("No regions available")
      }
      // Use the first available region
      region = regions[0]
    }

    // Get existing cart ID from cookies
    const cartId = cookies().get("_medusa_cart_id")?.value

    let cart
    if (cartId) {
      try {
        const { cart: existingCart } = await sdk.store.cart.retrieve(cartId)
        cart = existingCart
      } catch {
        // Cart doesn't exist, create new one
        const { cart: newCart } = await sdk.store.cart.create({
          region_id: region.id,
        })
        cart = newCart
        cookies().set("_medusa_cart_id", cart.id, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        })
      }
    } else {
      // Create new cart
      const { cart: newCart } = await sdk.store.cart.create({
        region_id: region.id,
      })
      cart = newCart
      cookies().set("_medusa_cart_id", cart.id, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    }

    // Add line item to cart with print order data in metadata
    await sdk.store.cart.createLineItem(
      cart.id,
      {
        variant_id: cartData.variant_id,
        quantity: cartData.quantity,
        metadata: {
          print_order: cartData.print_order_data,
        },
      }
    )

    return NextResponse.json({ success: true, cart_id: cart.id })
  } catch (error) {
    console.error("Error adding print order to cart:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
