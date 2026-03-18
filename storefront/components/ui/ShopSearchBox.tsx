"use client"

import { InstantSearch } from "react-instantsearch-hooks-web"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { PiMagnifyingGlass } from "react-icons/pi"
import { motion, AnimatePresence } from "framer-motion"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import HeaderHit from "./HeaderHit"
import HeaderHits from "./HeaderHits"

function ShopSearchBox() {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/results/${encodeURIComponent(searchQuery)}`)
      setShowResults(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowResults(value.length > 0)
  }

  const handleInputFocus = () => {
    if (query.length > 0) {
      setShowResults(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setShowResults(false)
    }, 200)
  }

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full relative" ref={searchRef}>
      <div className="w-full rounded-3xl border border-sbhtext bg-white p-2">
        <form className="flex items-center justify-between text-lg font-medium max-sm:text-sm">
          {/* Search Input Section */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search resources"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-500 px-3 py-2"
              />
            </div>
          </div>

          <button 
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(query)
            }}
            className="relative ml-2 flex items-center justify-center overflow-hidden rounded-full bg-b300 text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] max-xxl:!leading-none max-md:size-11 md:px-8 md:py-3"
          >
            <span className=" text-base !leading-none sm:text-xl md:hidden">
              <PiMagnifyingGlass />
            </span>
            <span className="relative z-10 max-md:hidden text-lg">Search</span>
          </button>
        </form>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <InstantSearch
              indexName={SEARCH_INDEX_NAME}
              searchClient={searchClient}
            >
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <HeaderHits 
                  hitComponent={HeaderHit} 
                  query={query}
                  onSubmit={(e: any) => handleSubmit(query)}
                />
              </div>
            </InstantSearch>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShopSearchBox
