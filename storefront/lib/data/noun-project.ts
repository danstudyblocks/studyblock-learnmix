const BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const headers = {
  "Content-Type": "application/json",
  "x-publishable-api-key": PUB_KEY,
}

export interface NounIcon {
  id: string | number
  name: string
  thumbnail: string
  preview: string
  svgUrl: string
  attribution: string
}

export async function searchNounIcons(
  query: string,
  page = 1,
  limit = 40
): Promise<{ icons: NounIcon[]; total: number }> {
  const params = new URLSearchParams({
    query,
    page: String(page),
    limit: String(limit),
  })
  const res = await fetch(`${BASE_URL}/store/noun-project/search?${params}`, { headers })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}

export async function fetchNounIconDataUrl(
  id: string | number
): Promise<{ dataUrl: string; mimeType: string }> {
  const params = new URLSearchParams({ id: String(id) })
  const res = await fetch(`${BASE_URL}/store/noun-project/icon?${params}`, { headers })
  if (!res.ok) throw new Error(`Icon fetch failed: ${res.status}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.error || "Failed to fetch icon")
  return data
}
