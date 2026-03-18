import { MedusaService } from "@medusajs/framework/utils"
import { CreateSvgAssetInput, UpdateSvgAssetInput } from "./types"
import SvgAsset from "./models/svg-asset"

class SvgAssetModuleService extends MedusaService({
  SvgAsset,
}) {
  async createSvgAsset(input: CreateSvgAssetInput) {
    const [asset] = await this.createSvgAssets([input])
    return asset
  }

  async updateSvgAsset(id: string, input: UpdateSvgAssetInput) {
    const [asset] = await this.updateSvgAssets([{ id, ...input }])
    return asset
  }

  async deleteSvgAsset(id: string) {
    await this.deleteSvgAssets([id])
  }

  async listSvgAssetsWithFilters(filters?: {
    category_top?: string
    category_sub?: string
    is_premium?: boolean
    creator_id?: string
    tags?: string[]
  }) {
    const where: any = {}
    
    if (filters?.category_top) {
      where.category_top = filters.category_top
    }
    
    if (filters?.category_sub) {
      where.category_sub = filters.category_sub
    }
    
    if (filters?.is_premium !== undefined) {
      where.is_premium = filters.is_premium
    }
    
    if (filters?.creator_id) {
      where.creator_id = filters.creator_id
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      where.tags = { $contains: filters.tags }
    }

    return await this.listSvgAssets(where)
  }

  async getSvgAssetById(id: string) {
    return await this.retrieveSvgAsset(id)
  }

  async getSvgAssetCategories() {
    const assets = await this.listSvgAssets()
    
    const topCategories = new Set<string>()
    const subCategories = new Set<string>()
    
    assets.forEach(asset => {
      if (asset.category_top) topCategories.add(asset.category_top)
      if (asset.category_sub) subCategories.add(asset.category_sub)
    })
    
    return {
      top_categories: Array.from(topCategories),
      sub_categories: Array.from(subCategories)
    }
  }
}

export default SvgAssetModuleService
