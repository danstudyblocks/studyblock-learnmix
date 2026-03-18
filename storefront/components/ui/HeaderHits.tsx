"use client"

import { clx } from "@medusajs/ui"
import React from "react"
import {
  UseHitsProps,
  useHits,
  useSearchBox,
} from "react-instantsearch-hooks-web"

import { ProductHit } from "@modules/search/components/hit"

type HeaderHitsProps<THit> = React.ComponentProps<"div"> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
    query: string
    onSubmit: (query: string) => void
  }

const HeaderHits = ({
  hitComponent: Hit,
  className,
  query,
  onSubmit,
  ...props
}: HeaderHitsProps<ProductHit>) => {
  const { hits } = useHits(props)

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query)
    }
  }

  return (
    <div
      className={clx(
        "transition-[height,max-height,opacity] duration-300 ease-in-out overflow-hidden w-full mb-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200",
        className,
        {
          "max-h-full opacity-100": !!query && query.length > 0,
          "max-h-0 opacity-0": !query || query.length === 0,
        }
      )}
    >
      {query && query.length > 0 && (
        <>
          {/* Search Results */}
          {hits.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">
                {hits.length} result{hits.length !== 1 ? 's' : ''} found
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                {hits.slice(0, 6).map((hit, index) => (
                  <div key={index}>
                    <Hit hit={hit as unknown as ProductHit} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {hits.length === 0 && query.length > 2 && (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm mb-2">
                No results found for &quot;{query}&quot;
              </div>
              <button
                onClick={handleSubmit}
                className="text-[#4893f6] hover:text-[#3a7bd5] text-sm font-medium"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          )}

          {/* View All Results Button */}
          {hits.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="w-full text-center text-[#4893f6] hover:text-[#3a7bd5] text-sm font-medium py-2"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default HeaderHits
