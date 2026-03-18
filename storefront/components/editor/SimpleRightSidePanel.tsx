"use client"

import { observer } from "mobx-react-lite"
import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react"
import { useRouter } from "next/navigation"
import { downloadHighQualityPdf } from "./utils/pdf"
import { setCartIdCookie } from "@/lib/data/cart"
import { 
  Download, 
  Share2, 
  Printer, 
  MessageCircle, 
  Upload 
} from "lucide-react"
import { uploadTemplate, fetchCategories } from "@/lib/data/vendor"

export interface DesignActionsRef {
  download: () => void
  share: () => void
  print: () => void
  addToLearnmix: () => void
}

const SimpleRightSidePanelInner = forwardRef<DesignActionsRef, { store: any; customer: any; sidebar?: boolean; isMobile?: boolean }>(
  function SimpleRightSidePanelInner({ store, customer, sidebar = true, isMobile }, ref) {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false)
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [templateData, setTemplateData] = useState(null)
    const [availableTopCategories, setAvailableTopCategories] = useState<string[]>([])
    const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([])
    const [showNewTopCategory, setShowNewTopCategory] = useState(false)
    const [showNewSubCategory, setShowNewSubCategory] = useState(false)
    const [isPrinting, setIsPrinting] = useState(false)
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [printProductType, setPrintProductType] = useState("poster")
    const [printQuantity, setPrintQuantity] = useState(1)
    const [themeDetails, setThemeDetails] = useState({
      title: store.name,
      description: "",
      isPremium: false,
      category_top: "",
      category_sub: "",
      tags: [] as string[],
      show_in_studio: false,
    })
    const [currentTag, setCurrentTag] = useState("")

    const handleDownload = async () => {
      try {
        await downloadHighQualityPdf(store, {
          fileName: "design.pdf",
          pixelRatio: 5,
          includeBleed: true,
          cropMarkSize: 0,
        })
      } catch (error) {
        console.error("Error downloading PDF:", error)
        alert("Failed to download PDF. Please try again.")
      }
    }

    const handleShare = () => {
      const json = store.toJSON()
      const data = JSON.stringify(json)
      console.log("Template data for sharing:", data)
      alert("Share functionality to be implemented with backend")
    }

    const handlePrint = () => {
      if (!customer?.id) {
        alert("Please sign in to submit a print order.")
        return
      }
      setShowPrintModal(true)
    }

    const handlePrintOrder = async () => {
      if (!customer?.id) {
        alert("Please sign in to submit a print order.")
        return
      }

      try {
        setIsPrinting(true)
        const designSnapshot = store.toJSON()
        const previewImage = await store.toDataURL({
          pixelRatio: 2,
          mimeType: "image/png",
          quality: 1,
        })

        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

        if (!publishableKey) {
          throw new Error("Missing publishable API key. Please configure NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.")
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/print-orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-publishable-api-key": publishableKey,
            },
            credentials: "include",
            body: JSON.stringify({
              title: store.name ?? "Print Order",
              design_snapshot: designSnapshot,
              preview_image: previewImage,
              customer_id: customer.id,
              metadata: {
                product_type: printProductType,
                quantity: printQuantity,
              },
            }),
          }
        )

        if (!response.ok) {
          const error = await response.json().catch(() => ({}))
          throw new Error(error?.message ?? "Failed to submit your print order. Please retry.")
        }

        const data = await response.json()
        console.log("Print order added to cart:", data)
        
        if (data.cart_id) {
          await setCartIdCookie(data.cart_id)
          router.push("/checkout?step=payment")
        } else {
          throw new Error("Failed to get cart ID from print order response")
        }
        
        setShowPrintModal(false)
      } catch (error) {
        console.error("Error creating print order:", error)
        alert(
          error instanceof Error
            ? `Failed to submit print order: ${error.message}`
            : "Failed to submit print order. Please try again."
        )
      } finally {
        setIsPrinting(false)
      }
    }

    const handleHelp = () => {
      window.open("your-help-url", "_blank")
    }

    const handleUploadTheme = async () => {
      if (!customer?.id) {
        alert("Please login to sell your design")
        return
      }

      const design_json = store.toJSON()
      console.log(design_json)

      if (!design_json || !design_json.pages || design_json.pages.length === 0 || design_json.pages[0].children.length === 0) {
        alert("Please create your design before sharing")
        return
      }

      try {
        const categories = await fetchCategories()
        console.log("Fetched categories:", categories)
        setAvailableTopCategories(categories.top_categories || [])
        setAvailableSubCategories(categories.sub_categories || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        setAvailableTopCategories(["Worksheet", "Poster", "Marketing", "Social Media"])
        setAvailableSubCategories(["design", "tech", "english", "math"])
      }

      setTemplateData(design_json)
      setIsUploadModalOpen(true)
    }

    const addTag = () => {
      if (currentTag.trim() && !themeDetails.tags.includes(currentTag.trim())) {
        setThemeDetails((prev) => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()],
        }))
        setCurrentTag("")
      }
    }

    const removeTag = (tagToRemove: string) => {
      setThemeDetails((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove),
      }))
    }

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addTag()
      }
    }

    useImperativeHandle(ref, () => ({
      download: handleDownload,
      share: handleShare,
      print: handlePrint,
      addToLearnmix: handleUploadTheme,
    }), [store?.name, customer?.id])

    const triggerConfetti = () => {
      const confettiColors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#6EE7B7"]
      const particleCount = 250
      const shapes = ["circle", "square", "rectangle"]

      for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
          const confetti = document.createElement("div")
          const shape = shapes[Math.floor(Math.random() * shapes.length)]
          const size = Math.random() * 8 + 8
          const startX = Math.random() * 100
          const drift = Math.random() * 40 - 20

          confetti.style.position = "fixed"
          confetti.style.left = `${startX}vw`
          confetti.style.top = "-20px"
          confetti.style.width = shape === "rectangle" ? `${size * 1.5}px` : `${size}px`
          confetti.style.height = shape === "rectangle" ? `${size * 0.6}px` : `${size}px`
          confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)]
          confetti.style.borderRadius = shape === "circle" ? "50%" : "0"
          confetti.style.zIndex = "9999"
          confetti.style.pointerEvents = "none"
          confetti.style.opacity = "0.9"
          confetti.style.transform = `rotate(${Math.random() * 360}deg)`

          document.body.appendChild(confetti)

          let posY = -20
          let rotation = Math.random() * 360
          const fallSpeed = Math.random() * 6 + 4
          const rotationSpeed = Math.random() * 30 - 15
          const startTime = performance.now()

          const fall = setInterval(() => {
            const elapsed = (performance.now() - startTime) / 1000
            posY += fallSpeed
            rotation += rotationSpeed * 0.016
            const posX = startX + drift * Math.sin(elapsed * 2)
            const opacity = Math.max(0.3, 1 - elapsed / 6)

            confetti.style.top = `${posY}px`
            confetti.style.left = `${posX}vw`
            confetti.style.transform = `rotate(${rotation}deg)`
            confetti.style.opacity = `${opacity}`

            if (elapsed > 6 || posY > window.innerHeight + 20) {
              clearInterval(fall)
              document.body.removeChild(confetti)
            }
          }, 16)
        }, i * (6000 / particleCount))
      }
    }

    const confirmUploadTemplate = async () => {
      const { title, description, isPremium, category_top, category_sub, tags, show_in_studio } = themeDetails

      if (!title.trim()) {
        alert("Please enter a design title.")
        return
      }

      setIsUploading(true)

      try {
        // Capture thumbnail from canvas
        let thumbnailDataUrl = null
        try {
          thumbnailDataUrl = await store.toDataURL({
            pixelRatio: 1,
            mimeType: "image/png",
            quality: 0.8,
          })
          console.log("Captured thumbnail:", thumbnailDataUrl ? "Success" : "Failed")
        } catch (error) {
          console.error("Error capturing thumbnail:", error)
        }

        const result = await uploadTemplate(templateData, customer.id, {
          title,
          description,
          isPremium,
          category_top: category_top || null,
          category_sub: category_sub || null,
          tags: tags.length > 0 ? tags : null,
          thumbnail: thumbnailDataUrl,
          isTemplate: true,
          show_in_studio: show_in_studio || false,
        })

        if (result.success) {
          triggerConfetti()
          alert("🎉 Template uploaded successfully! Your template will be live after admin approval.")
          setIsUploadModalOpen(false)
          setThemeDetails({
            title: store.name,
            description: "",
            isPremium: false,
            category_top: "",
            category_sub: "",
            tags: [],
            show_in_studio: false,
          })
        } else {
          alert("Error: " + result.error)
        }
      } catch (error) {
        alert("An unexpected error occurred")
      } finally {
        setIsUploading(false)
      }
    }

    const actions = [
      { id: "download", icon: Download, label: "Download", onClick: handleDownload },
      { id: "share", icon: Share2, label: "Share", onClick: handleShare },
      { id: "print", icon: Printer, label: "Print", onClick: handlePrint, disabled: isPrinting },
      { id: "help", icon: MessageCircle, label: "Chat | Help", onClick: handleHelp },
      { id: "upload", icon: Upload, label: "Add to Learnmix", onClick: handleUploadTheme },
    ]

    return (
      <>
        {sidebar && (
          <div className="w-20 bg-white border-l border-gray-200 flex flex-col items-center py-4 gap-4">
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  className={`group relative p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    action.disabled || (isUploading && action.id === "upload") ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  <Icon className="w-6 h-6 text-gray-700" />
                  
                  <span className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {action.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsUploadModalOpen(false)}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Upload Template</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Template Title</label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={themeDetails.title}
                    onChange={(e) => setThemeDetails((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter Template title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={themeDetails.description}
                    onChange={(e) => setThemeDetails((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your design"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="category_top" className="block text-sm font-medium text-gray-700 mb-1">Top Category</label>
                    {showNewTopCategory ? (
                      <div className="flex gap-2">
                        <input
                          id="category_top"
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={themeDetails.category_top}
                          onChange={(e) => setThemeDetails((prev) => ({ ...prev, category_top: e.target.value }))}
                          placeholder="Enter new category"
                        />
                        <button
                          type="button"
                          className="px-2 py-2 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setShowNewTopCategory(false)
                            setThemeDetails((prev) => ({ ...prev, category_top: "" }))
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <select
                            id="category_top"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={themeDetails.category_top}
                            onChange={(e) => setThemeDetails((prev) => ({ ...prev, category_top: e.target.value }))}
                          >
                            <option value="">Select category</option>
                            {availableTopCategories.map((category, index) => (
                              <option key={index} value={category}>{category}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                            onClick={() => setShowNewTopCategory(true)}
                          >
                            New
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category_sub" className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    {showNewSubCategory ? (
                      <div className="flex gap-2">
                        <input
                          id="category_sub"
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          value={themeDetails.category_sub}
                          onChange={(e) => setThemeDetails((prev) => ({ ...prev, category_sub: e.target.value }))}
                          placeholder="Enter new sub-category"
                        />
                        <button
                          type="button"
                          className="px-2 py-2 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setShowNewSubCategory(false)
                            setThemeDetails((prev) => ({ ...prev, category_sub: "" }))
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <select
                            id="category_sub"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={themeDetails.category_sub}
                            onChange={(e) => setThemeDetails((prev) => ({ ...prev, category_sub: e.target.value }))}
                          >
                            <option value="">Select sub-category</option>
                            {availableSubCategories.map((category, index) => (
                              <option key={index} value={category}>{category}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                            onClick={() => setShowNewSubCategory(true)}
                          >
                            New
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      id="tags"
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={addTag}
                    >
                      Add
                    </button>
                  </div>
                  {themeDetails.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {themeDetails.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {tag}
                          <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => removeTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="show_in_studio" className="text-sm font-medium text-gray-700">Allow users to edit this resource</label>
                    <input
                      id="show_in_studio"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={themeDetails.show_in_studio}
                      onChange={(e) => setThemeDetails((prev) => ({ ...prev, show_in_studio: e.target.checked }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">Premium Template</label>
                  <input
                    id="isPremium"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={themeDetails.isPremium}
                    onChange={(e) => setThemeDetails((prev) => ({ ...prev, isPremium: e.target.checked }))}
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => setIsUploadModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    onClick={confirmUploadTemplate}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Template"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Print Modal */}
        {showPrintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPrintModal(false)}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Order Print</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="printProductType" className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <select
                    id="printProductType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={printProductType}
                    onChange={(e) => setPrintProductType(e.target.value)}
                  >
                    <option value="poster">Poster</option>
                    <option value="sticker">Sticker</option>
                    <option value="postcard">Postcard</option>
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="a2">A2</option>
                    <option value="a1">A1</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="printQuantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    id="printQuantity"
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={printQuantity}
                    onChange={(e) => setPrintQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => setShowPrintModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    onClick={handlePrintOrder}
                    disabled={isPrinting}
                  >
                    {isPrinting ? "Processing..." : "Continue to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
)

export const SimpleRightSidePanel = observer(SimpleRightSidePanelInner)
