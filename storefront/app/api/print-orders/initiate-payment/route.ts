import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

export async function POST(request: NextRequest) {
  try {
    const {
      cart_id,
      email,
      first_name,
      last_name,
      address_1,
      city,
      postal_code,
      country_code,
      phone,
    } = await request.json()

    if (!cart_id) {
      return NextResponse.json({ error: "cart_id is required" }, { status: 400 })
    }

    // Forward the customer's JWT from cookie → Authorization header
    const jwt = request.cookies.get("_medusa_jwt")?.value
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUB_KEY,
    }
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`

    // 1. Update the cart with email + shipping/billing address
    const updateRes = await fetch(`${BACKEND}/store/carts/${cart_id}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        shipping_address: {
          first_name,
          last_name,
          address_1,
          city,
          postal_code,
          country_code: country_code || "gb",
          phone: phone || "",
        },
        billing_address: {
          first_name,
          last_name,
          address_1,
          city,
          postal_code,
          country_code: country_code || "gb",
          phone: phone || "",
        },
      }),
    })

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}))
      throw new Error(err?.message ?? `Failed to update cart (${updateRes.status})`)
    }

    const { cart } = await updateRes.json()

    // 2. Create payment collection if not already present
    let collectionId = cart.payment_collection?.id as string | undefined
    if (!collectionId) {
      const colRes = await fetch(`${BACKEND}/store/payment-collections`, {
        method: "POST",
        headers,
        body: JSON.stringify({ cart_id }),
      })
      if (colRes.ok) {
        const colData = await colRes.json()
        collectionId = colData.payment_collection?.id
      }
    }

    if (!collectionId) {
      throw new Error("Could not create or retrieve payment collection")
    }

    // 3. Initiate Stripe payment session
    const sessionRes = await fetch(
      `${BACKEND}/store/payment-collections/${collectionId}/payment-sessions`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ provider_id: "pp_stripe_stripe" }),
      }
    )

    if (!sessionRes.ok) {
      const err = await sessionRes.json().catch(() => ({}))
      throw new Error(err?.message ?? `Failed to initiate payment session (${sessionRes.status})`)
    }

    const sessionData = await sessionRes.json()
    const paymentSession = sessionData.payment_collection?.payment_sessions?.[0]
    const clientSecret = paymentSession?.data?.client_secret as string | undefined

    if (!clientSecret) {
      throw new Error("No client_secret returned from Stripe session")
    }

    return NextResponse.json({
      client_secret: clientSecret,
      payment_session_id: paymentSession?.id,
      collection_id: collectionId,
    })
  } catch (error) {
    console.error("[initiate-payment]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
