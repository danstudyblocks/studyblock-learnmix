import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const productId = req.params?.id ?? (req as any).params?.[0]

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" })
    }

    // Query digital products linked to the product (product-level templates)
    const { data: productDigitalProducts } = await query.graph({
      entity: "digital_product_product",
      fields: ["digital_product.*"],
      filters: {
        product_id: productId
      }
    })

    // Query digital products linked to variants (for downloadable PDFs)
    const { data: variantDigitalProducts } = await query.graph({
      entity: "digital_product_variant",
      fields: ["digital_product.*", "product_variant.product_id"],
      filters: {
        "product_variant.product_id": productId
      }
    })

    // Combine and deduplicate
    const allDigitalProducts = [
      ...productDigitalProducts.map((link: any) => link.digital_product),
      ...variantDigitalProducts.map((link: any) => link.digital_product)
    ]

    // Remove duplicates by ID
    const uniqueDigitalProducts = Array.from(
      new Map(allDigitalProducts.map((dp: any) => [dp.id, dp])).values()
    )

    res.json({
      digital_products: uniqueDigitalProducts
    })
  } catch (error) {
    console.error("Error fetching digital products for product:", error)
    res.status(500).json({ error: error.message })
  }
}

