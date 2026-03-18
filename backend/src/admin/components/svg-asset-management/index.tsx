import { useState, useEffect } from 'react'
import { Button } from '@medusajs/ui'
import { Plus, MagnifyingGlass, Funnel, PencilSquare, Trash, EyeMini } from '@medusajs/icons'
import SvgAssetUploadModal from './SvgAssetUploadModal'
import SvgAssetEditModal from './SvgAssetEditModal'
import SvgAssetPreviewModal from './SvgAssetPreviewModal'

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

const SvgAssetManagement = () => {
  const [assets, setAssets] = useState<SvgAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'premium' | 'free'>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingAsset, setEditingAsset] = useState<SvgAsset | null>(null)
  const [previewAsset, setPreviewAsset] = useState<SvgAsset | null>(null)
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
      
      const response = await fetch(`/admin/svg-assets?${params}`)
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

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SVG asset?')) return
    
    try {
      await fetch(`/admin/svg-assets/${id}`, { method: 'DELETE' })
      setAssets(assets.filter(asset => asset.id !== id))
    } catch (error) {
      console.error('Error deleting asset:', error)
    }
  }

  const handleAssetUpdate = (updatedAsset: SvgAsset) => {
    setAssets(assets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset))
    setEditingAsset(null)
  }

  const handleAssetCreate = (newAsset: SvgAsset) => {
    setAssets([newAsset, ...assets])
    setShowUploadModal(false)
  }

  useEffect(() => {
    fetchAssets()
  }, [searchTerm, categoryFilter, premiumFilter])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SVG Asset Management</h1>
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload SVG Assets
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button variant="secondary" onClick={fetchAssets}>
              <Funnel className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
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
            <div key={asset.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
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
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => setPreviewAsset(asset)}
                    >
                      <EyeMini className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => setEditingAsset(asset)}
                    >
                      <PencilSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
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
          <Button onClick={() => setShowUploadModal(true)}>
            Upload your first SVG asset
          </Button>
        </div>
      )}

      {/* Modals */}
      {showUploadModal && (
        <SvgAssetUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleAssetCreate}
        />
      )}
      
      {editingAsset && (
        <SvgAssetEditModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSuccess={handleAssetUpdate}
        />
      )}
      
      {previewAsset && (
        <SvgAssetPreviewModal
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      )}
    </div>
  )
}

export default SvgAssetManagement
