# SVG Asset Management System

## Overview
A comprehensive admin panel system for managing SVG design assets/icons, similar to the template system. This system allows administrators to upload, categorize, and manage SVG assets with premium/free marking functionality.

## Features

### 🎨 Asset Management
- **Upload SVG Files**: Bulk upload multiple SVG files with metadata
- **Asset Organization**: Categorize assets with top-level and sub-categories
- **Premium/Free Marking**: Mark assets as premium or free
- **Tag System**: Add custom tags for better organization and search
- **Preview System**: Visual preview of SVG assets
- **Search & Filter**: Advanced filtering by category, type, and tags

### 🔧 Technical Features
- **File Storage**: Integrated with MedusaJS file storage (S3/local)
- **Database Schema**: Comprehensive data model for SVG assets
- **API Endpoints**: Full CRUD operations for asset management
- **Admin Interface**: React-based admin panel components
- **Storefront Integration**: Public API for accessing assets

## System Architecture

### Database Schema
```typescript
interface SvgAsset {
  id: string
  name: string
  description?: string
  creator_id?: string
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
```

### File Structure
```
backend/src/
├── modules/svg-asset/
│   ├── models/svg-asset.ts          # Data model
│   ├── service.ts                   # Business logic
│   ├── types.ts                     # TypeScript types
│   ├── index.ts                     # Module exports
│   └── migrations/                  # Database migrations
├── api/admin/svg-assets/
│   ├── route.ts                     # CRUD operations
│   ├── [id]/route.ts                # Individual asset operations
│   ├── upload/route.ts              # File upload endpoint
│   └── categories/route.ts          # Category management
├── api/store/svg-assets/
│   └── route.ts                     # Public API
├── admin/components/svg-asset-management/
│   ├── index.tsx                    # Main management component
│   ├── SvgAssetUploadModal.tsx     # Upload interface
│   ├── SvgAssetEditModal.tsx       # Edit interface
│   └── SvgAssetPreviewModal.tsx    # Preview interface
└── workflows/create-svg-asset/      # Asset creation workflow
```

## API Endpoints

### Admin Endpoints
- `GET /admin/svg-assets` - List all assets with filters
- `POST /admin/svg-assets` - Create new asset
- `GET /admin/svg-assets/{id}` - Get specific asset
- `PUT /admin/svg-assets/{id}` - Update asset
- `DELETE /admin/svg-assets/{id}` - Delete asset
- `POST /admin/svg-assets/upload` - Upload SVG files
- `GET /admin/svg-assets/categories` - Get categories

### Store Endpoints
- `GET /store/svg-assets` - Public asset listing with filters

## Usage Examples

### Uploading Assets
```typescript
// Upload multiple SVG files
const formData = new FormData()
files.forEach(file => formData.append('files', file))

const response = await fetch('/admin/svg-assets/upload', {
  method: 'POST',
  body: formData
})
```

### Creating Asset Records
```typescript
const assetData = {
  name: 'Social Media Icons',
  description: 'Collection of social media icons',
  is_premium: false,
  category_top: 'Icons',
  category_sub: 'Social Media',
  tags: ['social', 'icons', 'media'],
  svg_url: 'https://s3.../icon.svg',
  file_id: 'file_123',
  mime_type: 'image/svg+xml'
}

const response = await fetch('/admin/svg-assets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(assetData)
})
```

### Filtering Assets
```typescript
// Get free icons in Social Media category
const params = new URLSearchParams({
  category_top: 'Icons',
  is_premium: 'false'
})

const response = await fetch(`/store/svg-assets?${params}`)
```

## Admin Panel Features

### Asset Management Interface
- **Grid View**: Visual grid of all assets with thumbnails
- **Search**: Real-time search across names, descriptions, and tags
- **Filters**: Category, premium/free, and tag-based filtering
- **Bulk Operations**: Select and manage multiple assets

### Upload Interface
- **Drag & Drop**: Easy file selection with drag-and-drop support
- **Bulk Upload**: Upload multiple SVG files at once
- **Metadata Entry**: Form for entering asset metadata
- **Tag Management**: Add/remove tags with autocomplete
- **Category Selection**: Choose from existing categories or create new ones

### Edit Interface
- **Asset Preview**: Full-size preview of SVG assets
- **Metadata Editing**: Edit all asset properties
- **Tag Management**: Add/remove tags
- **Category Updates**: Change asset categories
- **Premium Toggle**: Switch between premium and free

## Storefront Integration

### Asset Gallery Component
```tsx
import SvgAssetGallery from '@/components/svg-assets/SvgAssetGallery'

<SvgAssetGallery 
  onAssetSelect={(asset) => handleAssetSelect(asset)}
  showPreview={true}
/>
```

### API Functions
```typescript
import { fetchSvgAssets, downloadSvgAsset } from '@/lib/data/svg-assets'

// Fetch assets with filters
const { assets } = await fetchSvgAssets({
  category_top: 'Icons',
  is_premium: false,
  search: 'social'
})

// Download asset
await downloadSvgAsset(asset)
```

## Configuration

### MedusaJS Integration
The SVG asset module is integrated into the MedusaJS configuration:

```javascript
// medusa-config.js
import { SVG_ASSET_MODULE } from '@/modules/svg-asset'

const medusaConfig = {
  modules: [
    {
      key: SVG_ASSET_MODULE,
      resolve: "./modules/svg-asset"
    },
    // ... other modules
  ]
}
```

### Middleware Configuration
File upload middleware is configured for SVG assets:

```typescript
// middlewares.ts
{
  matcher: "/admin/svg-assets/upload",
  method: "POST",
  middlewares: [upload.array("files")]
}
```

## File Storage

### Development Environment
- **Provider**: Local file storage
- **Location**: `backend/static/` directory
- **Access**: Direct file system access

### Production Environment
- **Provider**: AWS S3
- **Configuration**: Environment variables for S3 credentials
- **Access**: Cloud-based with CDN capabilities

## Security & Access Control

### Admin Access
- **Authentication**: Required for all admin operations
- **Authorization**: Admin role required for asset management
- **File Upload**: Validated for SVG files only

### Public Access
- **Asset Listing**: Public access to asset metadata
- **File Download**: Direct access to SVG files
- **Premium Assets**: Marked but accessible (premium logic handled in frontend)

## Future Enhancements

### Planned Features
- **Asset Versioning**: Version control for SVG assets
- **Usage Analytics**: Track asset downloads and usage
- **Batch Operations**: Bulk edit and delete operations
- **Asset Relationships**: Link related assets
- **Advanced Search**: Full-text search with Elasticsearch
- **Asset Collections**: Group assets into collections
- **API Rate Limiting**: Implement rate limiting for public API
- **Asset Optimization**: Automatic SVG optimization
- **Thumbnail Generation**: Auto-generate thumbnails for assets

### Integration Opportunities
- **Design Editor**: Direct integration with Polotno design editor
- **Template System**: Use SVG assets in template creation
- **Marketplace**: Public marketplace for asset sharing
- **User Submissions**: Allow users to submit assets
- **Asset Reviews**: Rating and review system for assets

## Troubleshooting

### Common Issues
1. **File Upload Failures**: Check file size limits and SVG validation
2. **Storage Issues**: Verify S3 credentials and bucket permissions
3. **Database Errors**: Ensure proper migration execution
4. **API Errors**: Check authentication and authorization

### Debug Information
- **Logs**: Check server logs for detailed error information
- **Database**: Verify asset records in database
- **Storage**: Check file existence in storage system
- **API**: Test endpoints with tools like Postman

## Support

For technical support or questions about the SVG Asset Management System:
- Check the MedusaJS documentation
- Review the API documentation
- Test with the provided examples
- Check the admin panel for visual feedback
