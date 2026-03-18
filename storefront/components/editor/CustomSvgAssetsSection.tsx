import { fetchSvgAssets, SvgAsset } from "@/lib/data/svg-assets"
import { fetchs3json, fetchSvgContent } from "@/lib/data/vendor"
import { useState, useEffect } from "react"
import UpgradeButton from "./UpgradeButton"

// Premium Modal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>

        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Premium Icon
            </h3>
            <p className="text-gray-600 mb-6">
              This icon is part of our premium collection. Upgrade your account
              to access all premium icons and unlock unlimited creativity.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Premium Benefits:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Access to all premium icons</li>
                <li>• High-quality vector graphics</li>
                <li>• Advanced editing features</li>
                <li>• Priority support</li>
              </ul>
            </div>

            <UpgradeButton
              priceId="price_1RDTdyKKX37RuVxfUcQJZWNJ"
              creator_id={customer?.id}
              email={customer?.email}
              isPremium={customer?.metadata?.isPremium}
            />

            <button
              onClick={onClose}
              className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  )
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
    console.log("🎨 handleAssetClick triggered with asset:", asset)

    // Check if asset is premium
    if (asset.is_premium && !customer?.metadata?.isPremium) {
      console.log("🔒 Asset is premium, showing premium modal")
      setShowPremiumModal(true)
      return
    }

    setLoading(true)
    try {
      // Check if asset is WebP image
      const isWebP =
        asset.mime_type?.includes("webp") ||
        asset.svg_url?.toLowerCase().endsWith(".webp")

      let imageUrl = asset.svg_url
      console.log("📍 Original URL:", imageUrl)
      console.log("🖼️ Is WebP:", isWebP)

      // For both WebP and SVG images, fetch through backend to bypass CORS
      if (
        imageUrl &&
        typeof imageUrl === "string" &&
        imageUrl.startsWith("http")
      ) {
        console.log("🌐 Fetching image content from server (bypassing CORS)...")
        // Fetch the image content and convert to data URL to bypass CORS
        const response = await fetchSvgContent(imageUrl)
        console.log("📦 Fetch response:", response)

        if (!response.success || !response.dataUrl) {
          console.error("❌ Failed to fetch image content from URL:", imageUrl)
          console.error("Response:", response)
          setError("Failed to load icon")
          return
        }
        // Use the data URL instead of the original URL
        imageUrl = response.dataUrl
        console.log("✅ Converted to data URL (length):", imageUrl.length)
      }

      // Add element to the current active page
      if (!store.activePage) {
        console.error("❌ No active page available")
        setError("No active page to add icon")
        return
      }
      console.log("✅ Active page found:", store.activePage)

      // Calculate center position on canvas
      const canvasWidth = store.width || 1080
      const canvasHeight = store.height || 1080
      console.log("📐 Canvas dimensions:", { canvasWidth, canvasHeight })

      // Get dimensions - use asset dimensions if available, otherwise load image to get natural dimensions
      let finalWidth = asset.dimensions?.width || 220
      let finalHeight = asset.dimensions?.height || 220

      // If dimensions are not available, load the image to get natural dimensions
      if (
        !asset.dimensions ||
        !asset.dimensions.width ||
        !asset.dimensions.height
      ) {
        console.log("📏 Loading image to get natural dimensions...")
        try {
          const img = new Image()
          // Only set crossOrigin for external URLs to avoid CORS issues
          if (
            typeof window !== "undefined" &&
            imageUrl.startsWith("http") &&
            !imageUrl.startsWith(window.location.origin)
          ) {
            img.crossOrigin = "anonymous"
          } else if (imageUrl.startsWith("http")) {
            // For external URLs, try anonymous crossOrigin
            img.crossOrigin = "anonymous"
          }

          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              console.warn("⚠️ Image load timeout, using defaults")
              reject(new Error("Timeout"))
            }, 10000) // 10 second timeout

            img.onload = () => {
              clearTimeout(timeout)
              finalWidth = img.naturalWidth || img.width || 220
              finalHeight = img.naturalHeight || img.height || 220
              console.log("✅ Got natural dimensions:", {
                width: finalWidth,
                height: finalHeight,
              })
              resolve()
            }
            img.onerror = (err) => {
              clearTimeout(timeout)
              console.warn(
                "⚠️ Failed to load image for dimensions, using defaults",
                err
              )
              reject(err)
            }
            img.src = imageUrl
          })
        } catch (error) {
          console.warn("⚠️ Could not get image dimensions, using defaults")
          // Keep default dimensions
        }
      } else {
        console.log("📏 Using asset dimensions:", {
          width: finalWidth,
          height: finalHeight,
        })
      }

      const elementConfig = {
        type: isWebP ? "image" : "svg",
        src: imageUrl,
        x: (canvasWidth - finalWidth) / 2,
        y: (canvasHeight - finalHeight) / 2,
        width: finalWidth,
        height: finalHeight,
      }
      console.log("🎯 Adding element to canvas with config:", elementConfig)

      // Add the element to the active page
      store.activePage.addElement(elementConfig)
      console.log("✅ Icon added successfully!")
    } catch (error) {
      console.error("❌ Error adding icon:", error)
      //@ts-ignore
      setError(`Failed to add icon: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Enhanced filter function to include tags and subcategory
  const filteredAssets = assets.filter((asset) => {
    const searchLower = searchTerm.toLowerCase()

    // Check name
    const matchesName = asset.name.toLowerCase().includes(searchLower)

    // Check tags
    const matchesTags =
      asset.tags && Array.isArray(asset.tags)
        ? asset.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchLower)
          )
        : false

    // Check category
    const matchesCategory =
      !selectedCategory || asset.category_top === selectedCategory

    // Check subcategory
    const matchesSubCategory =
      !selectedSubCategory || asset.category_sub === selectedSubCategory

    return (matchesName || matchesTags) && matchesCategory && matchesSubCategory
  })

  // Group filtered assets by category_top
  const categories = filteredAssets.reduce(
    (acc: { [key: string]: SvgAsset[] }, asset) => {
      const category = asset.category_top || "Uncategorized"
      acc[category] = acc[category] || []
      acc[category].push(asset)
      return acc
    },
    {}
  )

  // Get unique subcategories (filtered by selected category if applicable)
  const availableSubCategories = Array.from(
    new Set(
      assets
        .filter(
          (asset) =>
            !selectedCategory || asset.category_top === selectedCategory
        )
        .map((asset) => asset.category_sub)
        .filter(Boolean)
    )
  ).sort()

  // SVG Asset Card Component
  const AssetCard = ({
    asset,
    size = "small",
  }: {
    asset: SvgAsset
    size?: "small" | "large"
  }) => {
    return (
      <div
        className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:shadow-md relative group"
        onClick={() => handleAssetClick(asset)}
      >
        {/* Premium Badge */}
        {asset.is_premium && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              PRO
            </div>
          </div>
        )}

        <div className="relative overflow-hidden rounded bg-gray-50 flex items-center justify-center min-h-[120px]">
          <img
            src={asset.thumbnail || asset.svg_url}
            alt={asset.name}
            className="w-full h-auto object-contain p-1 transition-transform duration-200 group-hover:scale-110"
            onError={(e) => {
              console.error(
                "Failed to load thumbnail:",
                asset.thumbnail || asset.svg_url
              )
              // Set a fallback or hide the broken image
              const target = e.target as HTMLImageElement
              target.style.display = "none"
            }}
            loading="lazy"
          />
          {asset.is_premium && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </div>

        <div className={size === "large" ? "space-y-1 mt-1" : "mt-1"}>
          <p
            className={`font-medium ${
              size === "large" ? "text-sm" : "text-xs"
            } text-center truncate`}
          >
            {asset.name}
          </p>
          {asset.category_sub && size === "large" && (
            <p className="text-xs text-gray-500 text-center truncate">
              {asset.category_sub}
            </p>
          )}

          {/* Tags */}
          {asset.tags && asset.tags.length > 0 && size === "large" && (
            <div className="flex flex-wrap gap-1 mt-1 justify-center">
              {asset.tags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {asset.tags.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{asset.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {asset.dimensions && size === "large" && (
            <p className="text-xs text-gray-400 text-center mt-1">
              {asset.dimensions.width}×{asset.dimensions.height}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (loading) return <div className="p-4 text-center">Loading icons...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

  return (
    <div className="p-4">
      <div className="flex flex-col justify-between mb-4">
        <h2 className="text-2xl font-bold mb-2">Icons</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or tags..."
            className="w-full p-3 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category and Subcategory Dropdowns */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <select
          value={selectedCategory || ""}
          onChange={(e) => {
            setSelectedCategory(e.target.value || null)
            setSelectedSubCategory(null) // Reset subcategory when category changes
          }}
          className="w-full md:w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
        >
          <option value="">All Categories</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedSubCategory || ""}
          onChange={(e) => setSelectedSubCategory(e.target.value || null)}
          className="w-full md:w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
          disabled={availableSubCategories.length === 0}
        >
          <option value="">All Subcategories</option>
          {availableSubCategories.map((subCategory) => (
            <option key={subCategory} value={subCategory}>
              {subCategory}
            </option>
          ))}
        </select>
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(categories).map(([category, items]) =>
          items.map((asset) => <AssetCard key={asset.id} asset={asset} />)
        )}
      </div>

      {/* No results message */}
      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No icons found</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        customer={customer}
      />
    </div>
  )
}

export default CustomSvgAssetsSection
