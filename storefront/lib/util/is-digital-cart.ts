import { HttpTypes } from "@medusajs/types"

/**
 * Check if a cart contains only digital products (print orders)
 * Digital products are identified by having print_order metadata in line items
 */
export function isDigitalCart(cart: HttpTypes.StoreCart | null): boolean {
  if (!cart || !cart.items || cart.items.length === 0) {
    return false
  }

  // Check if all line items have print_order metadata
  return cart.items.every((item) => {
    const metadata = item.metadata as Record<string, unknown> | null
    return metadata?.print_order !== undefined
  })
}

