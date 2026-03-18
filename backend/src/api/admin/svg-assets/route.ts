import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SVG_ASSET_MODULE } from "@/modules/svg-asset"
import SvgAssetModuleService from "@/modules/svg-asset/service"
import { CreateSvgAssetInput, UpdateSvgAssetInput } from "@/modules/svg-asset/types"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  try {
    const svgAssetModuleService = req.scope.resolve(SVG_ASSET_MODULE) as SvgAssetModuleService
    
    const { 
      category_top, 
      category_sub, 
      is_premium, 
      creator_id, 
      tags,
      limit = 20,
      offset = 0,
    } = req.validatedQuery || req.query || {}
    
    const filters: any = {}
    if (category_top) filters.category_top = category_top as string
    if (category_sub) filters.category_sub = category_sub as string
    if (is_premium !== undefined) filters.is_premium = is_premium === 'true'
    if (creator_id) filters.creator_id = creator_id as string
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags as string]
    
    const allAssets = await svgAssetModuleService.listSvgAssetsWithFilters(filters)
    
    // Apply pagination
    const paginatedAssets = allAssets.slice(Number(offset), Number(offset) + Number(limit))
    const totalCount = allAssets.length
    
    res.json({ 
      svg_assets: paginatedAssets,
      count: totalCount,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (error) {
    console.error("Error fetching SVG assets:", error)
    res.status(500).json({ error: error.message })
  }
}

export const POST = async (req: AuthenticatedMedusaRequest<CreateSvgAssetInput>, res: MedusaResponse) => {
  try {
    const svgAssetModuleService = req.scope.resolve(SVG_ASSET_MODULE) as SvgAssetModuleService
    
    const input: CreateSvgAssetInput = req.body
    
    // Validate required fields
    if (!input.name || !input.svg_url || !input.file_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Name, svg_url, and file_id are required"
      )
    }
    
    const asset = await svgAssetModuleService.createSvgAsset(input)
    
    res.status(201).json({ svg_asset: asset })
  } catch (error) {
    console.error("Error creating SVG asset:", error)
    res.status(500).json({ error: error.message })
  }
}
