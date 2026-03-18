import React, { useState } from 'react'
import { Button } from '@medusajs/ui'
import { XMark, ExclamationCircle } from '@medusajs/icons'

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

interface SvgAssetEditModalProps {
  asset: SvgAsset
  onClose: () => void
  onSuccess: (asset: SvgAsset) => void
}

const SvgAssetEditModal = ({ asset, onClose, onSuccess }: SvgAssetEditModalProps) => {
  const [formData, setFormData] = useState({
    name: asset.name,
    description: asset.description || '',
    is_premium: asset.is_premium,
    category_top: asset.category_top || '',
    category_sub: asset.category_sub || '',
    tags: asset.tags || [],
  })
  const [currentTag, setCurrentTag] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      })
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/admin/svg-assets/${asset.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          is_premium: formData.is_premium,
          category_top: formData.category_top || null,
          category_sub: formData.category_sub || null,
          tags: formData.tags.length > 0 ? formData.tags : null,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update asset')
      }

      const result = await response.json()
      onSuccess(result.svg_asset)
    } catch (error) {
      console.error('Error updating asset:', error)
      //@ts-ignore
      setError(error.message || 'Failed to update asset. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
              <ExclamationCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Asset name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Premium</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Mark as premium asset</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Asset description"
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Top Category</label>
              <input
                type="text"
                value={formData.category_top}
                onChange={(e) => setFormData({ ...formData, category_top: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Icons, Illustrations"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Sub Category</label>
              <input
                type="text"
                value={formData.category_sub}
                onChange={(e) => setFormData({ ...formData, category_sub: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Social Media, Business"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag and press Enter"
              />
              <Button type="button" onClick={handleAddTag} disabled={!currentTag.trim()}>
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XMark className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Asset Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Asset Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">File ID:</span> {asset.file_id}
              </div>
              <div>
                <span className="font-medium">MIME Type:</span> {asset.mime_type}
              </div>
              {asset.file_size && (
                <div>
                  <span className="font-medium">File Size:</span> {(asset.file_size / 1024).toFixed(1)} KB
                </div>
              )}
              {asset.dimensions && (
                <div>
                  <span className="font-medium">Dimensions:</span> {asset.dimensions.width}×{asset.dimensions.height}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
    </div>
  )
}

export default SvgAssetEditModal
