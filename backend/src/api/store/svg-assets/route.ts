import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SVG_ASSET_MODULE } from "@/modules/svg-asset"
import SvgAssetModuleService from "@/modules/svg-asset/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const svgAssetModuleService = req.scope.resolve(SVG_ASSET_MODULE) as SvgAssetModuleService
    
    const { category_top, category_sub, is_premium, tags, search } = req.query
    
    const filters: any = {}
    if (category_top) filters.category_top = category_top as string
    if (category_sub) filters.category_sub = category_sub as string
    if (is_premium !== undefined) filters.is_premium = is_premium === 'true'
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags as string]
    
    let assets = await svgAssetModuleService.listSvgAssetsWithFilters(filters)
    
    // Apply search filter if provided
    if (search) {
      const searchTerm = (search as string).toLowerCase()
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.description?.toLowerCase().includes(searchTerm) ||
        asset.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }
    
    res.json({ svg_assets: assets })
  } catch (error) {
    console.error("Error fetching SVG assets:", error)
    res.status(500).json({ error: error.message })
  }
}
