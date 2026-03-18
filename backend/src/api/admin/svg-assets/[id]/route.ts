import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SVG_ASSET_MODULE } from "@/modules/svg-asset"
import SvgAssetModuleService from "@/modules/svg-asset/service"
import { UpdateSvgAssetInput } from "@/modules/svg-asset/types"
import { MedusaError } from "@medusajs/framework/utils"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  try {
    const svgAssetModuleService = req.scope.resolve(SVG_ASSET_MODULE) as SvgAssetModuleService
    const { id } = req.params
    
    const asset = await svgAssetModuleService.getSvgAssetById(id)
    
    if (!asset) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "SVG asset not found"
      )
    }
    
    res.json({ svg_asset: asset })
  } catch (error) {
    console.error("Error fetching SVG asset:", error)
    res.status(500).json({ error: error.message })
  }
}

export const PUT = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  try {
    const svgAssetModuleService = req.scope.resolve(SVG_ASSET_MODULE) as SvgAssetModuleService
    const { id } = req.params
    const input: UpdateSvgAssetInput = req.body
    
    if (!id || id === '') {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Asset ID is required"
      )
    }
    
    const asset = await svgAssetModuleService.updateSvgAsset(id, input)
    
    res.json({ svg_asset: asset })
  } catch (error) {
    console.error("Error updating SVG asset:", error)
    res.status(500).json({ error: error.message })
  }
}

export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  try {
    const svgAssetModuleService = req.scope.resolve(SVG_ASSET_MODULE) as SvgAssetModuleService
    const { id } = req.params
    
    await svgAssetModuleService.deleteSvgAsset(id)
    
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting SVG asset:", error)
    res.status(500).json({ error: error.message })
  }
}
