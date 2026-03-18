import { fetchMiniTemplates, fetchs3json } from "@/lib/data/vendor"
import { observer } from "mobx-react-lite"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
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
              Premium Block
            </h3>
            <p className="text-gray-600 mb-6">
              This block is part of our premium collection. Upgrade your account
              to access all premium blocks and unlock unlimited creativity.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Premium Benefits:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Access to all premium blocks</li>
                <li>• High-resolution exports</li>
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

const BlocksSection = observer(
  ({ store, customer }: { store: any; customer: any }) => {
    const [blocks, setBlocks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
    )
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [showPremiumModal, setShowPremiumModal] = useState(false)

    const fetchBlocksData = async () => {
      setLoading(true)
      const result = await fetchMiniTemplates()
      if (result.success) {
        const miniTemplates = result.miniTemplates || []
        setBlocks(miniTemplates)
      } else {
        setError(result.error)
      }
      setLoading(false)
    }

    useEffect(() => {
      fetchBlocksData()
    }, [])

    const handleBlockClick = async (block: any) => {
      // Check if block is premium
      if (block.is_premium && !customer?.metadata?.isPremium) {
        setShowPremiumModal(true)
        return
      }

      setLoading(true)
      try {
        let blockData = block.template_data

        // Handle cases where template_data needs fetching or parsing
        if (!blockData || typeof blockData === "string") {
          // Handle URL (e.g., S3 JSON)
          if (typeof blockData === "string" && blockData.startsWith("http")) {
            const response = await fetchs3json(blockData)
            if (!response.success) {
              console.error("Failed to fetch block data from URL:", blockData)
              return
            }
            const jsonResponse = response.data
            blockData = await jsonResponse
          }
          // Handle JSON string
          else if (
            typeof blockData === "string" &&
            !blockData.startsWith("http")
          ) {
            blockData = JSON.parse(blockData)
          }
        }

        // Extract elements from the first page of the block
        const firstPage = blockData.pages?.[0]
        if (firstPage && firstPage.children) {
          const activePage = store.activePage
          if (!activePage) {
            console.error("No active page found")
            return
          }

          // Calculate center position for the block group
          const pageWidth = store.width || 1080
          const pageHeight = store.height || 1080

          // Check if there are any children
          if (!firstPage.children || firstPage.children.length === 0) {
            console.warn("Block has no children to insert")
            return
          }

          // Calculate bounding box of all elements to center the block as a group
          let minX = Infinity
          let minY = Infinity
          let maxX = -Infinity
          let maxY = -Infinity

          firstPage.children.forEach((child: any) => {
            const x = child.x || 0
            const y = child.y || 0
            const width = child.width || 0
            const height = child.height || 0

            minX = Math.min(minX, x)
            minY = Math.min(minY, y)
            maxX = Math.max(maxX, x + width)
            maxY = Math.max(maxY, y + height)
          })

          // Handle edge case where all values are still Infinity
          if (minX === Infinity || minY === Infinity) {
            // Fallback: center individual elements
            minX = 0
            minY = 0
            maxX = pageWidth
            maxY = pageHeight
          }

          // Calculate block group dimensions and center offset
          const blockWidth = maxX - minX || pageWidth
          const blockHeight = maxY - minY || pageHeight
          const blockCenterX = minX + blockWidth / 2
          const blockCenterY = minY + blockHeight / 2

          // Target center position on the page
          const targetCenterX = pageWidth / 2
          const targetCenterY = pageHeight / 2

          // Calculate offset to center the block
          const offsetX = targetCenterX - blockCenterX
          const offsetY = targetCenterY - blockCenterY

          // Add each element from the block to the current page with adjusted positions
          firstPage.children.forEach((child: any) => {
            // Generate new unique ID for each element
            const newId = uuidv4()

            // Preserve relative positions but center the entire block
            const x = (child.x || 0) + offsetX
            const y = (child.y || 0) + offsetY

            // Create element with new ID and adjusted position
            const elementData = {
              ...child,
              id: newId,
              x: x,
              y: y,
            }

            // Add element to the active page
            activePage.addElement(elementData)
          })
        } else if (blockData.nodes) {
          // Handle nodes structure (alternative format)
          const activePage = store.activePage
          if (!activePage) {
            console.error("No active page found")
            return
          }

          Object.values(blockData.nodes).forEach((node: any) => {
            const newId = uuidv4()
            const elementData = {
              ...node,
              id: newId,
            }
            activePage.addElement(elementData)
          })
        }
      } catch (error) {
        console.error("Error loading block:", error)
        //@ts-ignore
        setError(`Failed to load block: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    // Filter blocks by search term, category, and type
    const filteredBlocks = blocks.filter((block) => {
      const searchLower = searchTerm.toLowerCase()

      // Check name
      const matchesName = block.name?.toLowerCase().includes(searchLower)

      // Check tags
      const matchesTags =
        block.tags && Array.isArray(block.tags)
          ? block.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchLower)
            )
          : false

      // Check category - search is scoped to selected category
      const matchesCategory =
        !selectedCategory || block.category_top === selectedCategory

      // Check type - search is scoped to selected type
      const matchesType =
        !selectedType ||
        (selectedType === "text" &&
          (block.category_sub?.toLowerCase().includes("text") ||
            block.tags?.some((tag: string) =>
              tag.toLowerCase().includes("text")
            ))) ||
        (selectedType === "image" &&
          (block.category_sub?.toLowerCase().includes("image") ||
            block.tags?.some((tag: string) =>
              tag.toLowerCase().includes("image")
            ))) ||
        (selectedType === "layout" &&
          (block.category_sub?.toLowerCase().includes("layout") ||
            block.tags?.some((tag: string) =>
              tag.toLowerCase().includes("layout")
            )))

      // If searching, must match search term AND selected filters
      if (searchTerm) {
        return (matchesName || matchesTags) && matchesCategory && matchesType
      }
      
      // If not searching, just apply filters
      return matchesCategory && matchesType
    })

    // Get all unique categories from all blocks (not just filtered)
    const allCategories = Array.from(
      new Set(blocks.map((block) => block.category_top).filter(Boolean))
    ).sort()

    // Group filtered blocks by category_top
    const categories = filteredBlocks.reduce(
      (acc: { [key: string]: any[] }, block) => {
        const category = block.category_top || "Uncategorized"
        acc[category] = acc[category] || []
        acc[category].push(block)
        return acc
      },
      {}
    )

    // Block Card Component
    const BlockCard = ({ block }: { block: any }) => {
      return (
        <div
          className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:shadow-md relative group"
          onClick={() => handleBlockClick(block)}
        >
          {/* Premium Badge */}
          {block.is_premium && (
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

          <div className="relative overflow-hidden rounded bg-gray-50 flex items-center justify-center">
            <img
              src={
                block.thumbnail?.replace(/"/g, "") ||
                "https://via.placeholder.com/200x150?text=Block"
              }
              alt={block.name}
              className="w-full h-auto object-contain mb-2 transition-transform duration-200 group-hover:scale-105"
            />
            {block.is_premium && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </div>

          <div>
            <p className="font-medium text-sm text-center truncate">
              {block.name}
            </p>
            <p className="text-xs text-gray-500 text-center">
              {block.category_sub || "Block"}
            </p>

            {/* Tags */}
            {block.tags && block.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                {block.tags.slice(0, 2).map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {block.tags.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{block.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    if (loading) return <div className="p-4 text-center">Loading...</div>
    if (error)
      return <div className="p-4 text-center text-red-500">{error}</div>

    return (
      <div className="p-4">
        <div className="flex flex-col justify-between mb-4">
          <h2 className="text-2xl font-bold mb-2">Blocks</h2>
          <div className="relative">
            <input
              type="text"
              placeholder={
                selectedCategory 
                  ? `Search in ${selectedCategory}...` 
                  : selectedType
                  ? `Search in ${selectedType} blocks...`
                  : "Search blocks..."
              }
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
            {(searchTerm || selectedCategory || selectedType) && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory(null)
                  setSelectedType(null)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear all filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedType
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
              }`}
              onClick={() => setSelectedType(null)}
            >
              All Types
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === "text"
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
              }`}
              onClick={() => setSelectedType(selectedType === "text" ? null : "text")}
            >
              Text Blocks
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === "image"
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
              }`}
              onClick={() => setSelectedType(selectedType === "image" ? null : "image")}
            >
              Image Blocks
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === "layout"
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
              }`}
              onClick={() => setSelectedType(selectedType === "layout" ? null : "layout")}
            >
              Layouts
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        {allCategories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </button>
              {allCategories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-black text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blocks Grid */}
        {filteredBlocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {filteredBlocks.map((block) => (
              <BlockCard key={block.id} block={block} />
            ))}
          </div>
        ) : (
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
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No blocks found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search or filters
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Tip: Blocks are templates with category &quot;Blocks&quot; or tags
              containing &quot;block&quot;
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
)

export default BlocksSection
