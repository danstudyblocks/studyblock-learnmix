import { Button } from '@medusajs/ui'
import { XMark, ArrowDownTray, ArrowUpRightOnBox } from '@medusajs/icons'

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

interface SvgAssetPreviewModalProps {
  asset: SvgAsset
  onClose: () => void
}

const SvgAssetPreviewModal = ({ asset, onClose }: SvgAssetPreviewModalProps) => {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = asset.svg_url
    link.download = `${asset.name}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    window.open(asset.svg_url, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">SVG Asset Preview</h2>
          <Button variant="transparent" onClick={onClose}>
            <XMark className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div>
              <h3 className="font-medium mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="aspect-square flex items-center justify-center">
                  <img 
                    src={asset.svg_url} 
                    alt={asset.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={handleDownload} className="flex-1">
                  <ArrowDownTray className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
                <Button variant="secondary" onClick={handleOpenInNewTab}>
                  <ArrowUpRightOnBox className="w-4 h-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="font-medium mb-4">Asset Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{asset.name}</p>
                </div>

                {asset.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900">{asset.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      asset.is_premium 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {asset.is_premium ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  
                  {asset.dimensions && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                      <p className="text-gray-900">{asset.dimensions.width}×{asset.dimensions.height}</p>
                    </div>
                  )}
                </div>

                {asset.category_top && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Top Category</label>
                    <p className="text-gray-900">{asset.category_top}</p>
                  </div>
                )}

                {asset.category_sub && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <p className="text-gray-900">{asset.category_sub}</p>
                  </div>
                )}

                {asset.tags && asset.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.map((tag, index) => (
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

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File ID</label>
                    <p className="font-mono text-xs">{asset.file_id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">MIME Type</label>
                    <p className="text-gray-900">{asset.mime_type}</p>
                  </div>
                  
                  {asset.file_size && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                      <p className="text-gray-900">{(asset.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-gray-900">{new Date(asset.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SVG URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={asset.svg_url}
                      readOnly
                      className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded font-mono"
                    />
                    <Button
                      variant="transparent"
                      size="small"
                      onClick={() => navigator.clipboard.writeText(asset.svg_url)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SvgAssetPreviewModal
