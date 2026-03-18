import "server-only"
import { cookies } from "next/headers"

export const getAuthHeaders = (): { authorization: string } | Record<string, never> => {
  const token = cookies().get("_medusa_jwt")?.value
  if (token) return { authorization: `Bearer ${token}` }
  return {}
}

/** Use in async server code so the cookie is read from the current request (required in Next.js 15). */
export async function getAuthHeadersAsync(): Promise<{ authorization: string } | Record<string, never>> {
  const cookieStore = await Promise.resolve(cookies())
  const token = cookieStore.get("_medusa_jwt")?.value
  if (token) return { authorization: `Bearer ${token}` }
  return {}
}

export const setAuthToken = (token: string) => {
  cookies().set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    // Lax so the cookie is sent when Stripe redirects back to our site (strict would drop it)
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export const setVendorAuthToken = (token: string) => {
  cookies().set("_medusa_vendor_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = () => {
  cookies().set("_medusa_jwt", "", {
    maxAge: -1,
  })
}

export const getCartId = () => {
  return cookies().get("_medusa_cart_id")?.value
}

export const setCartId = (cartId: string) => {
  cookies().set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = () => {
  cookies().set("_medusa_cart_id", "", { maxAge: -1 })
}
