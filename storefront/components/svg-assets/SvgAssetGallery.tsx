import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiDownload, FiEye } from 'react-icons/fi'

interface SvgAsset {
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

interface SvgAssetGalleryProps {
  onAssetSelect?: (asset: SvgAsset) => void
  showPreview?: boolean
}

const SvgAssetGallery = ({ onAssetSelect, showPreview = true }: SvgAssetGalleryProps) => {
  const [assets, setAssets] = useState<SvgAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'premium' | 'free'>('all')
  const [selectedAsset, setSelectedAsset] = useState<SvgAsset | null>(null)
  const [categories, setCategories] = useState<{top_categories: string[], sub_categories: string[]}>({top_categories: [], sub_categories: []})

  useEffect(() => {
    fetchAssets()
    fetchCategories()
  }, [])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter) params.append('category_top', categoryFilter)
      if (premiumFilter !== 'all') params.append('is_premium', premiumFilter === 'premium' ? 'true' : 'false')
      
      const response = await fetch(`/store/svg-assets?${params}`)
      const data = await response.json()
      setAssets(data.svg_assets || [])
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/admin/svg-assets/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAssetClick = (asset: SvgAsset) => {
    if (onAssetSelect) {
      onAssetSelect(asset)
    } else if (showPreview) {
      setSelectedAsset(asset)
    }
  }

  const handleDownload = (asset: SvgAsset) => {
    const link = document.createElement('a')
    link.href = asset.svg_url
    link.download = `${asset.name}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    fetchAssets()
  }, [searchTerm, categoryFilter, premiumFilter])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.top_categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={premiumFilter}
              onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'premium' | 'free')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchAssets}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="aspect-square bg-gray-50 flex items-center justify-center p-4 cursor-pointer"
                onClick={() => handleAssetClick(asset)}
              >
                {asset.thumbnail ? (
                  <img 
                    src={asset.thumbnail} 
                    alt={asset.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No preview</div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm truncate">{asset.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    asset.is_premium 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {asset.is_premium ? 'Premium' : 'Free'}
                  </span>
                </div>
                
                {asset.description && (
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{asset.description}</p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {asset.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {asset.tags && asset.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{asset.tags.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {asset.dimensions && `${asset.dimensions.width}×${asset.dimensions.height}`}
                  </div>
                  
                  <div className="flex space-x-1">
                    {showPreview && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAsset(asset)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(asset)
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {assets.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No SVG assets found</div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">SVG Asset Preview</h2>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Preview</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="aspect-square flex items-center justify-center">
                      <img 
                        src={selectedAsset.svg_url} 
                        alt={selectedAsset.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(selectedAsset)}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <FiDownload className="w-4 h-4 mr-2" />
                    Download SVG
                  </button>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{selectedAsset.name}</p>
                    </div>

                    {selectedAsset.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p className="text-gray-900">{selectedAsset.description}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          selectedAsset.is_premium 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedAsset.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </div>
                      
                      {selectedAsset.dimensions && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                          <p className="text-gray-900">{selectedAsset.dimensions.width}×{selectedAsset.dimensions.height}</p>
                        </div>
                      )}
                    </div>

                    {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <div className="flex flex-wrap gap-1">
                          {selectedAsset.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SvgAssetGallery
