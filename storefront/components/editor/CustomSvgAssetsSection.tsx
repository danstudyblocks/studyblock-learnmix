import { fetchSvgAssets, SvgAsset } from "@/lib/data/svg-assets"
import { fetchs3json, fetchSvgContent } from "@/lib/data/vendor"
import { useState, useEffect } from "react"
import UpgradeButton from "./UpgradeButton"

const PremiumModal = ({
  isOpen,
  onClose,
  customer,
}: {
  isOpen: boolean
  onClose: () => void
  customer: any
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#a39b8e] transition hover:text-[#171717] text-xl leading-none"
        >
          ×
        </button>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#171717]">Premium Icon</h3>
          <p className="mt-2 text-sm leading-6 text-[#5d5549]">
            This icon is part of our premium collection. Upgrade to access all premium icons.
          </p>

          <div className="mt-5 rounded-2xl border border-[#d8d2c8] bg-[#fcfaf8] p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668]">Premium benefits</p>
            <ul className="mt-2 space-y-1 text-sm text-[#5d5549]">
              <li>• Access to all premium icons</li>
              <li>• High-quality vector graphics</li>
              <li>• Advanced editing features</li>
              <li>• Priority support</li>
            </ul>
          </div>

          <div className="mt-4 space-y-2">
            <UpgradeButton
              priceId="price_1RDTdyKKX37RuVxfUcQJZWNJ"
              creator_id={customer?.id}
              email={customer?.email}
              isPremium={customer?.metadata?.isPremium}
            />
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[#d4ccbf] px-4 py-2.5 text-sm font-semibold text-[#5d5549] transition hover:border-[#171717] hover:text-[#171717]"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const BrokenImagePlaceholder = () => (
  <div className="flex h-[72px] w-full items-center justify-center">
    <svg className="h-8 w-8 text-[#d8d2c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
)

const CustomSvgAssetsSection = ({
  store,
  customer,
}: {
  store: any
  customer: any
}) => {
  const [assets, setAssets] = useState<SvgAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [failedThumbnails, setFailedThumbnails] = useState<Set<string>>(new Set())
  const [addError, setAddError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const fetchSvgAssetsData = async () => {
    setLoading(true)
    const result = await fetchSvgAssets()
    if (result.success) {
      setAssets(result.assets || [])
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSvgAssetsData()
  }, [])

  const handleAssetClick = async (asset: SvgAsset) => {
    if (asset.is_premium && !customer?.metadata?.isPremium) {
      setShowPremiumModal(true)
      return
    }

    setAddError(null)
    setLoading(true)
    try {
      const isWebP =
        asset.mime_type?.includes("webp") ||
        asset.svg_url?.toLowerCase().endsWith(".webp")

      let imageUrl = asset.svg_url

      if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")) {
        const response = await fetchSvgContent(imageUrl)
        if (!response.success || !response.dataUrl) {
          setAddError("This icon couldn't be loaded. The source may be temporarily unavailable — try again in a moment.")
          return
        }
        imageUrl = response.dataUrl
      }

      if (!store.activePage) {
        setAddError("No active page to add icon")
        return
      }

      const canvasWidth = store.width || 1080
      const canvasHeight = store.height || 1080
      let finalWidth = asset.dimensions?.width || 220
      let finalHeight = asset.dimensions?.height || 220

      if (!asset.dimensions?.width || !asset.dimensions?.height) {
        try {
          const img = new Image()
          if (imageUrl.startsWith("http")) img.crossOrigin = "anonymous"
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Timeout")), 10000)
            img.onload = () => {
              clearTimeout(timeout)
              finalWidth = img.naturalWidth || img.width || 220
              finalHeight = img.naturalHeight || img.height || 220
              resolve()
            }
            img.onerror = (err) => { clearTimeout(timeout); reject(err) }
            img.src = imageUrl
          })
        } catch {
          // keep defaults
        }
      }

      store.activePage.addElement({
        type: isWebP ? "image" : "svg",
        src: imageUrl,
        x: (canvasWidth - finalWidth) / 2,
        y: (canvasHeight - finalHeight) / 2,
        width: finalWidth,
        height: finalHeight,
      })
    } catch (err) {
      // @ts-ignore
      setAddError(`Failed to add icon: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredAssets = assets.filter((asset) => {
    const q = searchTerm.toLowerCase()
    const matchesName = asset.name.toLowerCase().includes(q)
    const matchesTags = Array.isArray(asset.tags)
      ? asset.tags.some((tag: string) => tag.toLowerCase().includes(q))
      : false
    const matchesCategory = !selectedCategory || asset.category_top === selectedCategory
    const matchesSubCategory = !selectedSubCategory || asset.category_sub === selectedSubCategory
    return (matchesName || matchesTags) && matchesCategory && matchesSubCategory
  })

  const categories = filteredAssets.reduce((acc: Record<string, SvgAsset[]>, asset) => {
    const cat = asset.category_top || "Uncategorized"
    acc[cat] = acc[cat] || []
    acc[cat].push(asset)
    return acc
  }, {})

  const availableSubCategories = Array.from(
    new Set(
      assets
        .filter((a) => !selectedCategory || a.category_top === selectedCategory)
        .map((a) => a.category_sub)
        .filter(Boolean)
    )
  ).sort() as string[]

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
        <div className="border-b border-[#d8d2c8] px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">Graphics</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">Elements</h2>
        </div>
        <div className="flex flex-1 items-center justify-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d8d2c8] border-t-[#7b5cff]" />
          <span className="text-sm text-[#5d5549]">Loading elements…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#fcfaf8] px-6 text-center">
        <p className="text-sm text-[#5d5549]">{error}</p>
        <button
          type="button"
          onClick={fetchSvgAssetsData}
          className="rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2b2620]"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
      {/* Header */}
      <div className="border-b border-[#d8d2c8] px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">Graphics</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">Elements</h2>
        <p className="mt-3 text-sm leading-6 text-[#5d5549]">
          Browse icons and graphics to add to your design.
        </p>

        {/* Search */}
        <div className="relative mt-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a39b8e]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or tags…"
            className="w-full rounded-xl border border-[#d4ccbf] bg-white py-2.5 pl-9 pr-3 text-sm text-[#171717] outline-none transition placeholder:text-[#a39b8e] focus:border-[#7b5cff]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="mt-3 flex gap-2">
          <select
            value={selectedCategory || ""}
            onChange={(e) => { setSelectedCategory(e.target.value || null); setSelectedSubCategory(null) }}
            className="flex-1 rounded-xl border border-[#d4ccbf] bg-white px-3 py-2 text-sm text-[#171717] outline-none transition focus:border-[#7b5cff] cursor-pointer"
          >
            <option value="">All categories</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedSubCategory || ""}
            onChange={(e) => setSelectedSubCategory(e.target.value || null)}
            disabled={availableSubCategories.length === 0}
            className="flex-1 rounded-xl border border-[#d4ccbf] bg-white px-3 py-2 text-sm text-[#171717] outline-none transition focus:border-[#7b5cff] cursor-pointer disabled:opacity-50"
          >
            <option value="">All subcategories</option>
            {availableSubCategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add error banner */}
      {addError && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{addError}</span>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm text-[#5d5549]">No elements found.</p>
            <p className="text-xs text-[#a39b8e]">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {Object.values(categories).flat().map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleAssetClick(asset)}
                className="group relative overflow-hidden rounded-xl border border-[#d8d2c8] bg-white transition hover:border-[#171717] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              >
                {asset.is_premium && (
                  <div className="absolute right-1.5 top-1.5 z-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    PRO
                  </div>
                )}
                <div className="flex min-h-[80px] items-center justify-center bg-[#f3ede3] p-2">
                  {failedThumbnails.has(asset.id) ? (
                    <BrokenImagePlaceholder />
                  ) : (
                    <img
                      src={asset.thumbnail || asset.svg_url}
                      alt={asset.name}
                      className="h-auto max-h-[72px] w-full object-contain transition-transform duration-200 group-hover:scale-110"
                      onError={() => setFailedThumbnails((prev) => new Set(prev).add(asset.id))}
                      loading="lazy"
                    />
                  )}
                </div>
                <p className="truncate px-2 py-1.5 text-center text-[11px] font-medium text-[#2f2a24]">
                  {asset.name}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        customer={customer}
      />
    </div>
  )
}

export default CustomSvgAssetsSection
