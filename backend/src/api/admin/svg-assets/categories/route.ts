import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SVG_ASSET_MODULE } from "@/modules/svg-asset"
import SvgAssetModuleService from "@/modules/svg-asset/service"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  try {
    const svgAssetModuleService = req.scope.resolve(SVG_ASSET_MODULE) as SvgAssetModuleService
    
    const categories = await svgAssetModuleService.getSvgAssetCategories()
    
    res.json(categories)
  } catch (error) {
    console.error("Error fetching SVG asset categories:", error)
    res.status(500).json({ error: error.message })
  }
}
