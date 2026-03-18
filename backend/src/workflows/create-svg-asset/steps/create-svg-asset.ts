import { createStep } from "@medusajs/framework/workflows-sdk"
import { SVG_ASSET_MODULE } from "@/modules/svg-asset"
import SvgAssetModuleService from "@/modules/svg-asset/service"
import { CreateSvgAssetInput } from "@/modules/svg-asset/types"

export type CreateSvgAssetStepInput = CreateSvgAssetInput

export const createSvgAssetStep = createStep(
  "create-svg-asset",
  async (input: CreateSvgAssetStepInput, { container }) => {
    const svgAssetModuleService: SvgAssetModuleService = container.resolve(SVG_ASSET_MODULE)
    
    const svg_asset = await svgAssetModuleService.createSvgAsset(input)
    
    return { svg_asset }
  },
  async (compensationData, { container }) => {
    // Compensation logic if needed
    if (compensationData?.svg_asset?.id) {
      const svgAssetModuleService: SvgAssetModuleService = container.resolve(SVG_ASSET_MODULE)
      await svgAssetModuleService.deleteSvgAsset(compensationData.svg_asset.id)
    }
  }
)
