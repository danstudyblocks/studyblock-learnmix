import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image, FileText, Film, Music, Trash2, Download, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ImageWithFallback } from "@/components/studio/ImageWithFallback";

interface UploadDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'audio';
  size: number;
  uploadDate: Date;
  url: string;
  thumbnail?: string;
}

// Mock uploaded files data
const mockFiles: UploadedFile[] = [
  {
    id: '1',
    name: 'design-mockup.jpg',
    type: 'image',
    size: 2456789,
    uploadDate: new Date('2024-12-15'),
    url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'brand-logo.png',
    type: 'image',
    size: 891234,
    uploadDate: new Date('2024-12-14'),
    url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400',
    thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'product-photo.jpg',
    type: 'image',
    size: 3456789,
    uploadDate: new Date('2024-12-13'),
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop'
  },
  {
    id: '4',
    name: 'presentation.pdf',
    type: 'document',
    size: 5234567,
    uploadDate: new Date('2024-12-12'),
    url: '#'
  },
  {
    id: '5',
    name: 'team-photo.jpg',
    type: 'image',
    size: 1876543,
    uploadDate: new Date('2024-12-11'),
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop'
  },
  {
    id: '6',
    name: 'background-texture.jpg',
    type: 'image',
    size: 2987654,
    uploadDate: new Date('2024-12-10'),
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop'
  }
];

export function UploadDropdown({ isOpen, onClose }: UploadDropdownProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(mockFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: getFileType(file.type),
        size: file.size,
        uploadDate: new Date(),
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
    });
  };

  const getFileType = (mimeType: string): UploadedFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Film className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setSelectedFiles(prev => prev.filter(id => id !== fileId));
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const filteredFiles = uploadedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-50" style={{ height: '33vh' }}>
      <div className="h-full flex">
        {/* Upload Section */}
        <div className="w-1/3 border-r border-border flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">Upload Files</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Drag & Drop Area */}
          <div className="flex-1 p-4">
            <div
              className={`h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileSelect}
            >
              <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
                isDragOver ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <Upload className={`w-8 h-8 ${isDragOver ? 'text-white' : 'text-gray-500'}`} />
              </div>
              
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">
                  {isDragOver ? 'Drop files here' : 'Drag & drop files'}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse your computer
                </p>
                <Button 
                  variant={isDragOver ? 'default' : 'outline'} 
                  size="sm"
                  className="pointer-events-none"
                >
                  Choose Files
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-gray-400 text-center">
                <p>Supports: JPG, PNG, PDF, MP4, and more</p>
                <p>Max file size: 10MB</p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* File Library Section */}
        <div className="flex-1 flex flex-col">
          {/* Header with Search */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Your Files</h4>
              <div className="text-sm text-gray-500">
                {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Files Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredFiles.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`group relative aspect-square rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                      selectedFiles.includes(file.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    {/* File Preview */}
                    <div className="w-full h-full rounded-lg overflow-hidden">
                      {file.type === 'image' && file.thumbnail ? (
                        <ImageWithFallback
                          src={file.thumbnail}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className={`p-3 rounded-lg ${
                            file.type === 'document' ? 'bg-red-100 text-red-600' :
                            file.type === 'video' ? 'bg-purple-100 text-purple-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {getFileIcon(file.type)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Info Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-end">
                      <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full">
                        <div className="text-xs font-medium truncate mb-1">{file.name}</div>
                        <div className="text-xs text-gray-300">{formatFileSize(file.size)}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle preview/view
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>

                    {/* Selection Indicator */}
                    {selectedFiles.includes(file.id) && (
                      <div className="absolute top-2 left-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Upload className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg mb-2">No files found</p>
                <p className="text-sm">
                  {searchQuery ? 'Try a different search term' : 'Upload some files to get started'}
                </p>
              </div>
            )}
          </div>

          {/* Selected Files Actions */}
          {selectedFiles.length > 0 && (
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFiles([])}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Add to Canvas
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}