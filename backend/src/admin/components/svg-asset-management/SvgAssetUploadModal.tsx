import React, { useState, useRef } from 'react'
import { Button } from '@medusajs/ui'
import { XMark, ArrowUpTray, ExclamationCircle } from '@medusajs/icons'

interface SvgAssetUploadModalProps {
  onClose: () => void
  onSuccess: (asset: any) => void
}

const SvgAssetUploadModal = ({ onClose, onSuccess }: SvgAssetUploadModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_premium: false,
    category_top: '',
    category_sub: '',
    tags: [] as string[],
  })
  const [currentTag, setCurrentTag] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const allowedFiles = files.filter(file => 
      file.type === 'image/svg+xml' || 
      file.type === 'image/webp' ||
      file.name.toLowerCase().endsWith('.svg') ||
      file.name.toLowerCase().endsWith('.webp')
    )
    
    if (allowedFiles.length !== files.length) {
      setError('Only SVG and WebP files are allowed')
      return
    }
    
    setSelectedFiles(allowedFiles)
    setError('')
  }

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
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one file (SVG or WebP)')
      return
    }

    setUploading(true)
    setError('')

    try {
      // First upload files
      const uploadFormData = new FormData()
      selectedFiles.forEach(file => {
        uploadFormData.append('files', file)
      })

      const uploadResponse = await fetch('/admin/svg-assets/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload files')
      }

      const uploadResult = await uploadResponse.json()
      
      // Create assets for each uploaded file
      const createPromises = uploadResult.files.map(async (file: any, index: number) => {
        const fileName = selectedFiles[index].name
        const fileType = selectedFiles[index].type
        const baseName = fileName.replace(/\.(svg|webp)$/i, '')
        
        // Convert filename to title case (e.g., "my-icon-name" -> "My Icon Name")
        const formatTitle = (str: string) => {
          return str
            .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        }
        
        // Use formData.name for single file, or formatted filename for multiple files
        const assetName = selectedFiles.length === 1 
          ? formData.name 
          : formatTitle(baseName)
        
        const assetData = {
          name: assetName,
          description: formData.description,
          is_premium: formData.is_premium,
          category_top: formData.category_top || null,
          category_sub: formData.category_sub || null,
          tags: formData.tags.length > 0 ? formData.tags : null,
          svg_url: file.url,
          file_id: file.id,
          mime_type: fileType || (fileName.toLowerCase().endsWith('.webp') ? 'image/webp' : 'image/svg+xml'),
          file_size: selectedFiles[index].size,
        }

        const response = await fetch('/admin/svg-assets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assetData)
        })

        if (!response.ok) {
          throw new Error('Failed to create asset')
        }

        return response.json()
      })

      const results = await Promise.all(createPromises)
      
      // Call success callback for each created asset
      results.forEach(result => {
        onSuccess(result.svg_asset)
      })

      onClose()
    } catch (error) {
      console.error('Error uploading assets:', error)
      setError('Failed to upload assets. Please try again.')
    } finally {
      setUploading(false)
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

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon Files (SVG/WebP)</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
              onClick={() => fileInputRef.current?.click()}
            >
              <ArrowUpTray className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} file(s) selected` 
                  : 'Click to select icon files'
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">SVG and WebP files are supported</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".svg,.webp,image/svg+xml,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

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
              <p className="text-xs text-gray-500 mt-1">
                {selectedFiles.length === 1 
                  ? 'This name will be used for the uploaded asset' 
                  : selectedFiles.length > 1
                    ? 'Multiple files will use their filenames (formatted as titles)'
                    : 'Used for single file uploads'}
              </p>
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

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Assets'}
            </Button>
          </div>
        </form>
    </div>
  )
}

export default SvgAssetUploadModal
