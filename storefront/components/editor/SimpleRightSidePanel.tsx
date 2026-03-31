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
  Upload,
  X,
  Tag,
} from "lucide-react"
import { uploadTemplate } from "@/lib/data/vendor"

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
    const [isPrinting, setIsPrinting] = useState(false)
    const [showPrintModal, setShowPrintModal] = useState(false)
    const [printProductType, setPrintProductType] = useState("poster")
    const [printQuantity, setPrintQuantity] = useState(1)
    const [themeDetails, setThemeDetails] = useState({
      title: store.name,
      description: "",
      isPremium: true,
      subjects: [] as string[],
      tags: [] as string[],
      show_in_studio: true,
    })
    const [currentTag, setCurrentTag] = useState("")
    const [currentSubject, setCurrentSubject] = useState("")

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

    const addSubject = () => {
      const trimmed = currentSubject.trim()
      if (trimmed && !themeDetails.subjects.includes(trimmed)) {
        setThemeDetails((prev) => ({ ...prev, subjects: [...prev.subjects, trimmed] }))
      }
      setCurrentSubject("")
    }

    const removeSubject = (subject: string) => {
      setThemeDetails((prev) => ({ ...prev, subjects: prev.subjects.filter((s) => s !== subject) }))
    }

    const handleSubjectKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") { e.preventDefault(); addSubject() }
    }

    const confirmUploadTemplate = async () => {
      // Flush any text still sitting in the inputs
      const finalSubjects = currentSubject.trim()
        ? [...themeDetails.subjects, ...currentSubject.split(",").map((s) => s.trim()).filter(Boolean)]
        : themeDetails.subjects
      const finalTags = currentTag.trim()
        ? [...themeDetails.tags, ...currentTag.split(",").map((t) => t.trim()).filter(Boolean)]
        : themeDetails.tags

      const { title, description } = themeDetails
      const category_top = finalSubjects[0] || null
      const category_sub = finalSubjects.slice(1).join(", ") || null

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
          isPremium: true,
          category_top: category_top || null,
          category_sub: category_sub || null,
          tags: finalTags.length > 0 ? finalTags : null,
          thumbnail: thumbnailDataUrl,
          isTemplate: true,
          show_in_studio: true,
        })

        if (result.success) {
          triggerConfetti()
          alert("🎉 Template uploaded successfully! Your template will be live after admin approval.")
          setIsUploadModalOpen(false)
          setThemeDetails({
            title: store.name,
            description: "",
            isPremium: true,
            subjects: [],
            tags: [],
            show_in_studio: true,
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(23,23,23,0.45)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsUploadModalOpen(false)}
          >
            <div
              className="relative w-full max-w-xl rounded-2xl border border-[#e8e0d8] bg-[#FCFAF8] shadow-[0_24px_64px_rgba(15,23,42,0.18)] flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e8e0d8]">
                <div>
                  <h2 className="text-lg font-semibold text-[#171717] tracking-tight">Upload Resource</h2>
                  <p className="text-xs text-[#8a7f75] mt-0.5">Share your design with the community</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e8e0d8] bg-white text-[#6b6058] hover:border-[#171717] hover:text-[#171717] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-[#8a7f75] mb-1.5">
                    Template Title <span className="text-[#171717]">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0c8be] rounded-lg text-[#171717] placeholder-[#b0a89e] focus:outline-none focus:border-[#171717] transition-colors"
                    value={themeDetails.title}
                    onChange={(e) => setThemeDetails((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Year 6 Reading Comprehension"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-[#8a7f75] mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0c8be] rounded-lg text-[#171717] placeholder-[#b0a89e] focus:outline-none focus:border-[#171717] transition-colors resize-none"
                    value={themeDetails.description}
                    onChange={(e) => setThemeDetails((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Briefly describe what this template is for…"
                    rows={3}
                  />
                </div>

                {/* Subjects */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8a7f75] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0c8be] rounded-lg text-[#171717] placeholder-[#b0a89e] focus:outline-none focus:border-[#171717] transition-colors"
                    value={currentSubject}
                    onChange={(e) => setCurrentSubject(e.target.value)}
                    onKeyPress={handleSubjectKeyPress}
                    placeholder="e.g. Maths, Science, English…"
                  />
                  {themeDetails.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {themeDetails.subjects.map((subject, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#d0c8be] text-[#4a403a] rounded-full text-xs font-medium">
                          {subject}
                          <button type="button" onClick={() => removeSubject(subject)} className="text-[#b0a89e] hover:text-[#171717] transition-colors ml-0.5">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8a7f75] mb-1.5">
                    Tags
                  </label>
                  <div className="relative">
                    <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#b0a89e]" />
                    <input
                      type="text"
                      className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-[#d0c8be] rounded-lg text-[#171717] placeholder-[#b0a89e] focus:outline-none focus:border-[#171717] transition-colors"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Type a tag and press Enter…"
                    />
                  </div>
                  {themeDetails.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {themeDetails.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#d0c8be] text-[#4a403a] rounded-full text-xs font-medium"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-[#b0a89e] hover:text-[#171717] transition-colors ml-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info note */}
                <p className="text-xs text-[#8a7f75] leading-relaxed">
                  This resource will be added to the{" "}
                  <span className="font-medium text-[#4a403a]">Learnmix store</span> to support educators worldwide. It will be linked to your store page and visible in your My Account area.
                </p>

              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e8e0d8] bg-[#FCFAF8] rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#6b6058] bg-white border border-[#d0c8be] rounded-full hover:border-[#171717] hover:text-[#171717] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmUploadTemplate}
                  disabled={isUploading}
                  className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full border transition-colors ${
                    isUploading
                      ? "bg-[#d0c8be] border-[#d0c8be] text-white cursor-not-allowed"
                      : "bg-[#171717] border-[#171717] text-white hover:bg-[#2d2d2d]"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Upload Resource
                    </>
                  )}
                </button>
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
