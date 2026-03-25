import { fetchs3json, fetchTemplates } from "@/lib/data/vendor"
import { observer } from "mobx-react-lite"
import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import PremiumTemplateModal from "@/components/editor-page/PremiumTemplateModal"

const CustomTemplatesSection = observer(({ store, customer }: { store: any; customer: any }) => {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const fetchTemplatesData = async () => {
    setLoading(true)
    const result = await fetchTemplates()
    if (result.success) {
      setTemplates(result.templates || [])
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTemplatesData()
  }, [])

  const handleTemplateClick = async (template: any) => {
    if (template.is_premium && !customer?.metadata?.isPremium) {
      setShowPremiumModal(true)
      return
    }

    setLoading(true)
    try {
      let templateData = template.template_data

      if (!templateData || typeof templateData === "string") {
        if (typeof templateData === "string" && templateData.startsWith("http")) {
          const response = await fetchs3json(templateData)
          if (!response.success) return
          templateData = await response.data
        } else if (typeof templateData === "string") {
          templateData = JSON.parse(templateData)
        }
      }

      const cleanedTemplateData = {
        width: templateData.width || 1080,
        height: templateData.height || 1080,
        unit: templateData.unit || "px",
        dpi: templateData.dpi || 72,
        pages: (templateData.pages || []).map((page: any) => ({
          ...page,
          id: page.id || `page_${uuidv4()}`,
          children: page.children || [],
          background: page.background || "white",
          width: page.width || "auto",
          height: page.height || "auto",
          bleed: page.bleed || 0,
          duration: page.duration || 5000,
        })),
        ...(templateData.nodes ? { nodes: templateData.nodes } : {}),
      }

      if (cleanedTemplateData.pages?.length || cleanedTemplateData.nodes) {
        store.loadJSON(cleanedTemplateData)
      } else {
        store.loadJSON({
          width: 1080,
          height: 1080,
          pages: [{ id: `page_${uuidv4()}`, children: [], background: "white", width: "auto", height: "auto", bleed: 0, duration: 5000 }],
          unit: "px",
          dpi: 72,
        })
      }
    } catch (err) {
      // @ts-ignore
      setError(`Failed to load template: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const q = searchTerm.toLowerCase()
    const matchesName = template.name.toLowerCase().includes(q)
    const matchesTags = Array.isArray(template.tags)
      ? template.tags.some((tag: string) => tag.toLowerCase().includes(q))
      : false
    const matchesCategory = !selectedCategory || template.category_top === selectedCategory
    const matchesSubCategory = !selectedSubCategory || template.category_sub === selectedSubCategory
    return (matchesName || matchesTags) && matchesCategory && matchesSubCategory
  })

  const categories = filteredTemplates.reduce((acc: Record<string, any[]>, template) => {
    const cat = template.category_top || "Other"
    acc[cat] = acc[cat] || []
    acc[cat].push(template)
    return acc
  }, {})

  const availableSubCategories = Array.from(
    new Set(
      templates
        .filter((t) => !selectedCategory || t.category_top === selectedCategory)
        .map((t) => t.category_sub)
        .filter(Boolean)
    )
  ).sort() as string[]

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
        <div className="border-b border-[#d8d2c8] px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">Library</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">Templates</h2>
        </div>
        <div className="flex flex-1 items-center justify-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d8d2c8] border-t-[#7b5cff]" />
          <span className="text-sm text-[#5d5549]">Loading templates…</span>
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
          onClick={fetchTemplatesData}
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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">Library</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">Templates</h2>
        <p className="mt-3 text-sm leading-6 text-[#5d5549]">
          Choose a ready-made template to start your design.
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

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm text-[#5d5549]">No templates found.</p>
            <p className="text-xs text-[#a39b8e]">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {Object.values(categories).flat().map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateClick(template)}
                className="group relative overflow-hidden rounded-xl border border-[#d8d2c8] bg-white transition hover:border-[#171717] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              >
                {template.is_premium && (
                  <div className="absolute right-1.5 top-1.5 z-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    PRO
                  </div>
                )}
                <div className="bg-[#f3ede3]">
                  <img
                    src={template.thumbnail?.replace(/"/g, "") || "https://www.w3schools.com/css/paris.jpg"}
                    alt={template.name}
                    className="h-auto w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <p className="truncate px-2 py-1.5 text-center text-[11px] font-medium text-[#2f2a24]">
                  {template.name}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <PremiumTemplateModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        customer={customer}
        primaryAction="checkout"
      />
    </div>
  )
})

export default CustomTemplatesSection
