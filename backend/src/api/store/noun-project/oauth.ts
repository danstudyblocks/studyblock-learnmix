import crypto from "crypto"

/** Generate an OAuth 1.0a Authorization header for two-legged (consumer-only) requests. */
export function createOAuthHeader(
  method: string,
  urlString: string,
  consumerKey: string,
  consumerSecret: string
): string {
  const url = new URL(urlString)

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  }

  // Collect all params (oauth + query string) for signature base
  const allParams: Record<string, string> = { ...oauthParams }
  url.searchParams.forEach((value, key) => {
    allParams[key] = value
  })

  // Percent-encode keys and values, sort, join
  const normalizedParams = Object.entries(allParams)
    .map(([k, v]) => [pct(k), pct(v)])
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join("&")

  // Base string: METHOD&encoded_base_url&encoded_params
  const baseUrl = `${url.protocol}//${url.host}${url.pathname}`
  const baseString = `${method.toUpperCase()}&${pct(baseUrl)}&${pct(normalizedParams)}`

  // Signing key: consumer_secret& (empty token secret for two-legged)
  const signingKey = `${pct(consumerSecret)}&`
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64")

  oauthParams["oauth_signature"] = signature

  const headerValue = Object.entries(oauthParams)
    .map(([k, v]) => `${pct(k)}="${pct(v)}"`)
    .join(", ")

  return `OAuth ${headerValue}`
}

function pct(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}
