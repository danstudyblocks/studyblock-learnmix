"use server"
import axios from "axios";

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_API_KEY!,
  },
});


export interface SvgAsset {
  id: string
  name: string
  description?: string
  is_premium: boolean
  category_top?: string
  category_sub?: string
  tags?: string[]
  thumbnail?: string
  svg_url: string
  file_id: string
  mime_type: string
  file_size?: number
  dimensions?: { width: number; height: number }
  created_at: string
  updated_at: string
}

export interface SvgAssetFilters {
  category_top?: string
  category_sub?: string
  is_premium?: boolean
  search?: string
  tags?: string[]
}

export async function fetchSvgAssets(filters?: SvgAssetFilters) {
  try {
    const params = new URLSearchParams()
    
    if (filters?.category_top) params.append('category_top', filters.category_top)
    if (filters?.category_sub) params.append('category_sub', filters.category_sub)
    if (filters?.is_premium !== undefined) params.append('is_premium', filters.is_premium.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => params.append('tags', tag))
    }

    const { data } = await apiClient.get(`/store/svg-assets?${params}`)
    
    return {
      success: true,
      assets: data.svg_assets || [],
      message: "SVG assets fetched successfully!",
    }
  } catch (error: any) {
    console.error("SVG assets fetch error:", error)
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || "An unexpected error occurred",
      errorCode: error.response?.status,
    }
  }
}

export async function fetchSvgAssetCategories() {
  try {
    const { data } = await apiClient.get('/admin/svg-assets/categories')
    
    return {
      success: true,
      categories: data,
      message: "SVG asset categories fetched successfully!",
    }
  } catch (error: any) {
    console.error("SVG asset categories fetch error:", error)
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || "An unexpected error occurred",
      errorCode: error.response?.status,
    }
  }
}

export async function downloadSvgAsset(asset: SvgAsset) {
  try {
    const link = document.createElement('a')
    link.href = asset.svg_url
    link.download = `${asset.name}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return {
      success: true,
      message: "SVG asset downloaded successfully!",
    }
  } catch (error: any) {
    console.error("SVG asset download error:", error)
    
    return {
      success: false,
      error: error.message || "Failed to download SVG asset",
    }
  }
}
