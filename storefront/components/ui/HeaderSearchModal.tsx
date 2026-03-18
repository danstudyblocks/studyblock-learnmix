"use client"

import { InstantSearch } from "react-instantsearch-hooks-web"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { PiMagnifyingGlass, PiX } from "react-icons/pi"
import { motion, AnimatePresence } from "framer-motion"

import { SEARCH_INDEX_NAME, searchClient } from "@lib/search-client"
import HeaderHit from "./HeaderHit"
import HeaderHits from "./HeaderHits"

interface HeaderSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function HeaderSearchModal({ isOpen, onClose }: HeaderSearchModalProps) {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")

  // Close modal on outside click
  const handleOutsideClick = (event: MouseEvent) => {
    if (event.target === searchRef.current) {
      onClose()
    }
  }

  // Close modal on escape key
  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("click", handleOutsideClick)
      window.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick)
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/results/${encodeURIComponent(searchQuery)}`)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[75]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Search Modal */}
          <div className="fixed inset-0 px-5 sm:p-0" ref={searchRef}>
            <div className="flex flex-col justify-start w-full h-fit transform p-5 items-center text-left align-middle transition-all max-h-[75vh] bg-transparent shadow-none">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex absolute flex-col h-fit w-full sm:w-[600px] lg:w-[700px]"
                data-testid="search-modal-container"
              >
                <InstantSearch
                  indexName={SEARCH_INDEX_NAME}
                  searchClient={searchClient}
                >
                  {/* Search Input */}
                  <div className="w-full flex items-center gap-x-3 p-4 bg-white text-black shadow-lg rounded-lg border border-gray-200">
                    <PiMagnifyingGlass className="text-[#4893f6] text-xl flex-shrink-0" />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search resources"
                        className="w-full bg-transparent border-none outline-none text-sm placeholder:text-gray-500"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      <PiX className="text-xl" />
                    </button>
                  </div>

                  {/* Search Results */}
                  <div className="flex-1 mt-4">
                    <HeaderHits 
                      hitComponent={HeaderHit} 
                      query={query}
                      onSubmit={(e: any) => handleSubmit(query)}
                    />
                  </div>
                </InstantSearch>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
