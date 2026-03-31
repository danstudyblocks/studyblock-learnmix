import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""
const ADMIN_EMAIL = process.env.MEDUSA_ADMIN_EMAIL ?? "dan@doodle.ac"
const ADMIN_PASSWORD = process.env.MEDUSA_ADMIN_PASSWORD ?? "password"

async function getAdminToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND}/auth/user/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.token ?? null
  } catch {
    return null
  }
}

// The FedEx shipping option created in Medusa admin (£4.95)
const FEDEX_SHIPPING_OPTION_ID = "so_01KN1ZHJ9SW7DPW9Z0CRX5VAQW"

type Address = {
  first_name?: string
  last_name?: string
  address_1?: string
  city?: string
  postal_code?: string
  country_code?: string
  phone?: string
}

async function ensureCartAddress(
  cartId: string,
  email: string,
  address: Address,
  headers: Record<string, string>
): Promise<void> {
  await fetch(`${BACKEND}/store/carts/${cartId}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      shipping_address: { country_code: "gb", ...address },
      billing_address: { country_code: "gb", ...address },
    }),
  })
}

async function ensureShippingMethod(
  cartId: string,
  headers: Record<string, string>
): Promise<void> {
  // Check if shipping method already added
  const cartRes = await fetch(
    `${BACKEND}/store/carts/${cartId}?fields=+shipping_methods.id`,
    { headers }
  )
  if (cartRes.ok) {
    const { cart } = await cartRes.json()
    if (cart?.shipping_methods?.length > 0) return
  }

  // Try to add FedEx directly — no need to list options first
  const addRes = await fetch(`${BACKEND}/store/carts/${cartId}/shipping-methods`, {
    method: "POST",
    headers,
    body: JSON.stringify({ option_id: FEDEX_SHIPPING_OPTION_ID }),
  })

  // If FedEx option fails, fall back to first available
  if (!addRes.ok) {
    const optRes = await fetch(
      `${BACKEND}/store/shipping-options?cart_id=${cartId}`,
      { headers }
    )
    if (optRes.ok) {
      const { shipping_options } = await optRes.json()
      const first = shipping_options?.[0]?.id
      if (first) {
        await fetch(`${BACKEND}/store/carts/${cartId}/shipping-methods`, {
          method: "POST",
          headers,
          body: JSON.stringify({ option_id: first }),
        })
      }
    }
  }
}

async function ensurePaymentCollection(
  cartId: string,
  headers: Record<string, string>
): Promise<void> {
  // Check if collection + pending session already exists
  const cartRes = await fetch(
    `${BACKEND}/store/carts/${cartId}?fields=+payment_collection.id,+payment_collection.payment_sessions`,
    { headers }
  )
  let collectionId: string | undefined
  if (cartRes.ok) {
    const { cart } = await cartRes.json()
    collectionId = cart?.payment_collection?.id
    const hasPending = cart?.payment_collection?.payment_sessions?.some(
      (s: any) => s.status === "pending"
    )
    if (collectionId && hasPending) return
  }

  // Create collection if needed
  if (!collectionId) {
    const colRes = await fetch(`${BACKEND}/store/payment-collections`, {
      method: "POST",
      headers,
      body: JSON.stringify({ cart_id: cartId }),
    })
    if (!colRes.ok) return
    const colData = await colRes.json()
    collectionId = colData.payment_collection?.id
  }

  if (!collectionId) return

  // Initiate a session — try manual/system first, then stripe
  for (const provider_id of ["pp_system_default", "pp_stripe_stripe"]) {
    const res = await fetch(
      `${BACKEND}/store/payment-collections/${collectionId}/payment-sessions`,
      { method: "POST", headers, body: JSON.stringify({ provider_id }) }
    )
    if (res.ok) return
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cart_id, email, address, pdf_url } = await request.json()

    if (!cart_id) {
      return NextResponse.json({ error: "cart_id is required" }, { status: 400 })
    }

    const jwt = request.cookies.get("_medusa_jwt")?.value
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUB_KEY,
    }
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`

    // If delivery details provided (test mode bypass), set them on the cart first
    if (email && address) {
      await ensureCartAddress(cart_id, email, address, headers)
    }

    // Ensure payment collection exists, then complete
    // (Custom line items carry no shipping profile — no shipping method needed)
    await ensurePaymentCollection(cart_id, headers)

    const res = await fetch(`${BACKEND}/store/carts/${cart_id}/complete`, {
      method: "POST",
      headers,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.message ?? `Failed to complete cart (${res.status})`)
    }

    const data = await res.json()
    const orderId = data.type === "order" ? data.order?.id : null

    // Write PDF URL + key print details to the order metadata so it's
    // visible at the top level in the Medusa admin orders page
    if (orderId && pdf_url) {
      const adminToken = await getAdminToken()
      if (adminToken) {
        await fetch(`${BACKEND}/admin/orders/${orderId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            metadata: {
              pdf_url,
              print_order: true,
            },
          }),
        }).catch(() => {}) // non-fatal
      }
    }

    return NextResponse.json({
      success: true,
      order_id: orderId,
      type: data.type,
    })
  } catch (error) {
    console.error("[complete-order]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
