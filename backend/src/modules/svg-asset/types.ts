export enum SvgAssetCategory {
  ICONS = "icons",
  ILLUSTRATIONS = "illustrations", 
  PATTERNS = "patterns",
  SHAPES = "shapes",
  LOGOS = "logos",
  DECORATIONS = "decorations"
}

export interface SvgAssetDimensions {
  width: number
  height: number
}

export interface CreateSvgAssetInput {
  name: string
  description?: string
  creator_id?: string
  is_premium?: boolean
  category_top?: string
  category_sub?: string
  tags?: string[]
  thumbnail?: string
  svg_url: string
  file_id: string
  mime_type?: string
  file_size?: number
  dimensions?: SvgAssetDimensions
}

export interface UpdateSvgAssetInput {
  name?: string
  description?: string
  is_premium?: boolean
  category_top?: string
  category_sub?: string
  tags?: string[]
  thumbnail?: string
  dimensions?: SvgAssetDimensions
}
