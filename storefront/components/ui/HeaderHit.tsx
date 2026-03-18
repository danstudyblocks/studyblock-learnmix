import { HttpTypes } from "@medusajs/types"
import Link from "next/link"
import Image from "next/image"

export type ProductHit = {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: HttpTypes.StoreProductVariant[]
  collection_handle: string | null
  collection_id: string | null
}

type HitProps = {
  hit: ProductHit
}

const HeaderHit = ({ hit }: HitProps) => {
  return (
    <Link
      href={`/products/${hit.handle}`}
      data-testid="search-result"
      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0">
        {hit.thumbnail ? (
          <Image
            src={hit.thumbnail}
            alt={hit.title}
            width={48}
            height={48}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 group-hover:text-[#4893f6] transition-colors">
          {hit.title}
        </div>
        {hit.description && (
          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
            {hit.description}
          </div>
        )}
        {hit.variants && hit.variants.length > 0 && hit.variants[0].calculated_price?.calculated_amount && (
          <div className="text-xs text-[#4893f6] font-medium mt-1">
            ${(hit.variants[0].calculated_price.calculated_amount / 100).toFixed(2)}
          </div>
        )}
      </div>

      {/* Arrow Icon */}
      <div className="flex-shrink-0 text-gray-400 group-hover:text-[#4893f6] transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export default HeaderHit
