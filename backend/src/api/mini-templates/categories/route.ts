import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product"
import DigitalProductModuleService from "@/modules/digital-product/service"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const digitalProductModuleService = req.scope.resolve(
      DIGITAL_PRODUCT_MODULE
    ) as DigitalProductModuleService

    const digitalProducts =
      await digitalProductModuleService.listDigitalProducts()

    const miniTemplates = digitalProducts.filter(
      (product) =>
        product?.isTemplate === true &&
        product?.template_data &&
        (product.category_top?.toLowerCase() === "blocks" ||
          product.category_sub?.toLowerCase() === "blocks" ||
          product.tags?.some((tag: string) =>
            tag?.toLowerCase?.()?.includes("block")
          ))
    )

    const topCategoriesSet = new Set<string>()
    const subCategoriesSet = new Set<string>()

    miniTemplates.forEach((product) => {
      if (product.category_top) {
        topCategoriesSet.add(product.category_top)
      }
      if (product.category_sub) {
        subCategoriesSet.add(product.category_sub)
      }
    })

    res.json({
      top_categories: Array.from(topCategoriesSet),
      sub_categories: Array.from(subCategoriesSet),
    })
  } catch (error) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to fetch mini template categories: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    )
  }
}

