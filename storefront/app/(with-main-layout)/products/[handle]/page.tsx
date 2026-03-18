import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getRegion, listRegions } from "@lib/data/regions"
import { getProductByHandle, getProductsList } from "@lib/data/products"
import ProductTemplate from "@/components/product/ProductTemplate"

type Props = {
  params: { countryCode: string; handle: string }
}

// Simplify the static params generation
export async function generateStaticParams() {
  try {
    // Get all products first
    const products = await getProductsList({ countryCode: 'gb' })
    if (!products?.response?.products) {
      return []
    }

    // Return simplified params structure
    return products.response.products.map((product) => ({
      handle: product.handle,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

// Add dynamic config to handle cache issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { handle } = params
    const region = await getRegion('gb')
    
    if (!region) {
      return {
        title: 'Product Not Found',
        description: 'Product Not Found',
      }
    }

    const product = await getProductByHandle(handle, region.id)

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'Product Not Found',
      }
    }

    return {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      openGraph: {
        title: `${product.title} | Medusa Store`,
        description: `${product.title}`,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: 'Error',
      description: 'Error loading product',
    }
  }
}

export default async function ProductPage({ params }: Props) {
  try {
    const region = await getRegion("gb")
    
    if (!region) {
      notFound()
    }

    const pricedProduct = await getProductByHandle(params.handle, region.id)
    
    if (!pricedProduct) {
      notFound()
    }

    // Clean up product data
    const cleanProduct = {
      ...pricedProduct,
      tags: undefined // Remove tags more cleanly
    }

    return (
      <ProductTemplate
        product={cleanProduct}
        region={region}
        countryCode={"gb"}
      />
    )
  } catch (error) {
    console.error("Error rendering product page:", error)
    notFound()
  }
}