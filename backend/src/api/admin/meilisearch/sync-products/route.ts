import { 
  AuthenticatedMedusaRequest, 
  MedusaResponse
} from "@medusajs/framework"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT)
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

    // Get all products with their variants
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "*",
        "variants.*",
        "images.*",
        "categories.*",
        "tags.*",
        "variants.options.*",
        "variants.prices.*"
      ]
    })

    logger.info(`Found ${products.length} products to sync to MeiliSearch`)

    // Transform products for MeiliSearch
    const meiliProducts = products.map(product => {
      const variant = product.variants?.[0] // Get first variant
      
      return {
        id: product.id,
        title: product.title,
        description: product.description || "",
        handle: product.handle,
        variant_sku: variant?.sku || "",
        thumbnail: product.thumbnail || product.images?.[0]?.url || "",
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at,
        // Add more fields as needed
        categories: product.categories?.map(cat => cat.name) || [],
        tags: product.tags?.map(tag => tag.value) || [],
        variant_id: variant?.id || "",
        variant_title: variant?.title || "",
        price: variant?.prices?.[0]?.amount || 0,
        currency_code: variant?.prices?.[0]?.currency_code || "usd"
      }
    })

    // Send to MeiliSearch
    const meiliSearchHost = process.env.MEILISEARCH_HOST
    const meiliSearchKey = process.env.MEILISEARCH_ADMIN_KEY

    if (!meiliSearchHost || !meiliSearchKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "MeiliSearch configuration is missing"
      )
    }

    // Index products in MeiliSearch
    const response = await fetch(`${meiliSearchHost}/indexes/products/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${meiliSearchKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meiliProducts)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to sync products to MeiliSearch: ${errorText}`
      )
    }

    const result = await response.json()
    
    logger.info(`Successfully synced ${result.taskUid} products to MeiliSearch`)

    res.json({
      success: true,
      message: `Successfully synced ${products.length} products to MeiliSearch`,
      task_uid: result.taskUid,
      products_count: products.length
    })

  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
    logger.error("Error syncing products to MeiliSearch:", error)
    
    res.status(500).json({
      success: false,
      message: "Failed to sync products to MeiliSearch",
      error: error.message
    })
  }
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  try {
    const meiliSearchHost = process.env.MEILISEARCH_HOST
    const meiliSearchKey = process.env.MEILISEARCH_ADMIN_KEY

    if (!meiliSearchHost || !meiliSearchKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "MeiliSearch configuration is missing"
      )
    }

    // Get index stats
    const response = await fetch(`${meiliSearchHost}/indexes/products/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${meiliSearchKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to get MeiliSearch stats: ${errorText}`
      )
    }

    const stats = await response.json()

    res.json({
      success: true,
      stats: stats
    })

  } catch (error) {
    const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)
    logger.error("Error getting MeiliSearch stats:", error)
    
    res.status(500).json({
      success: false,
      message: "Failed to get MeiliSearch stats",
      error: error.message
    })
  }
}
