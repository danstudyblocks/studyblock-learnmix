"use client"

import { useState, useEffect, useRef } from "react"
import { searchNounIcons, fetchNounIconDataUrl, type NounIcon } from "@/lib/data/noun-project"

const NounProjectSection = ({ store }: { store: any }) => {
  const [query, setQuery] = useState("")
  const [icons, setIcons] = useState<NounIcon[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searching, setSearching] = useState(false)
  const [addingId, setAddingId] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = async (q: string, p: number) => {
    if (!q.trim()) {
      setIcons([])
      setTotal(0)
      return
    }
    setSearching(true)
    setError(null)
    try {
      const result = await searchNounIcons(q.trim(), p)
      if (p === 1) setIcons(result.icons)
      else setIcons((prev) => [...prev, ...result.icons])
      setTotal(result.total)
    } catch (err: any) {
      setError("Search failed. Please try again.")
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setPage(1)
    debounceRef.current = setTimeout(() => doSearch(query, 1), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const handleIconClick = async (icon: NounIcon) => {
    if (!store.activePage) return
    setAddingId(icon.id)
    setError(null)
    try {
      const result = await fetchNounIconDataUrl(icon.id)
      if (!result.dataUrl) throw new Error("No image data returned")

      const isSvg = result.mimeType === "image/svg+xml"
      const canvasWidth = store.width || 1080
      const canvasHeight = store.height || 1080
      const size = Math.min(canvasWidth, canvasHeight) * 0.2

      store.activePage.addElement({
        type: isSvg ? "svg" : "image",
        src: result.dataUrl,
        x: (canvasWidth - size) / 2,
        y: (canvasHeight - size) / 2,
        width: size,
        height: size,
      })
    } catch (err: any) {
      setError("Couldn't load this icon. Try another or search again.")
    } finally {
      setAddingId(null)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    doSearch(query, next)
  }

  const hasMore = icons.length < total

  return (
    <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
      {/* Header */}
      <div className="border-b border-[#d8d2c8] px-6 py-6 flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">Graphics</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight">Shapes & Icons</h2>
        <p className="mt-3 text-sm leading-6 text-[#5d5549]">
          Search millions of icons from the Noun Project.
        </p>

        {/* Search */}
        <div className="relative mt-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a39b8e]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search icons…"
            className="w-full rounded-xl border border-[#d4ccbf] bg-white py-2.5 pl-9 pr-3 text-sm text-[#171717] outline-none transition placeholder:text-[#a39b8e] focus:border-[#7b5cff]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-[#d8d2c8] border-t-[#7b5cff]" />
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!query.trim() && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <svg className="h-10 w-10 text-[#d8d2c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-[#5d5549]">Search to browse icons</p>
            <p className="text-xs text-[#a39b8e]">Millions of icons available</p>
          </div>
        )}

        {query.trim() && !searching && icons.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm text-[#5d5549]">No icons found for "{query}"</p>
            <p className="text-xs text-[#a39b8e]">Try a different search term</p>
          </div>
        )}

        {icons.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((icon) => {
                const isAdding = addingId === icon.id
                const thumbFailed = failedThumbs.has(String(icon.id))
                return (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => handleIconClick(icon)}
                    disabled={isAdding}
                    title={icon.name}
                    className="group relative overflow-hidden rounded-xl border border-[#d8d2c8] bg-white transition hover:border-[#7b5cff] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] disabled:opacity-60"
                  >
                    <div className="flex h-[60px] items-center justify-center bg-[#f3ede3] p-2">
                      {isAdding ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#d8d2c8] border-t-[#7b5cff]" />
                      ) : thumbFailed ? (
                        <svg className="h-6 w-6 text-[#d8d2c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <img
                          src={icon.thumbnail}
                          alt={icon.name}
                          className="h-auto max-h-[52px] w-full object-contain transition-transform duration-200 group-hover:scale-110"
                          onError={() => setFailedThumbs((prev) => new Set(prev).add(String(icon.id)))}
                          loading="lazy"
                        />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={searching}
                className="mt-4 w-full rounded-xl border border-[#d4ccbf] bg-white px-4 py-2.5 text-sm font-semibold text-[#3d352c] transition hover:border-[#171717] disabled:opacity-50"
              >
                {searching ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NounProjectSection
