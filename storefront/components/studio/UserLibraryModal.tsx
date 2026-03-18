import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/studio/ImageWithFallback";
import { 
  Search, 
  Grid3x3, 
  Shapes, 
  Image, 
  FileText, 
  Folder, 
  Star, 
  Clock, 
  Edit2,
  Plus,
  MessageCircle,
  Crown,
  Settings,
  User
} from "lucide-react";
// import avatarImage from '../../public/images/user-img.png';

interface UserLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

interface LibraryItem {
  id: string;
  name: string;
  type: 'template' | 'element' | 'image' | 'document';
  category: string;
  thumbnail: string;
  dateCreated: string;
  dateModified: string;
  isStarred: boolean;
  size?: string;
  format?: string;
}

interface UserStats {
  name: string;
  email: string;
  joinDate: string;
  plan: 'Free' | 'Pro' | 'Premium';
  templatesUploaded: number;
  totalDownloads: number;
  totalViews: number;
  earnings: number;
  following: number;
  followers: number;
}

const mockUserData: UserStats = {
  name: "Dan Hopper",
  email: "dan@doodle.ac",
  joinDate: "2023-03-15",
  plan: "Pro",
  templatesUploaded: 12,
  totalDownloads: 2847,
  totalViews: 15432,
  earnings: 342.50,
  following: 89,
  followers: 156
};

const mockRecentTemplates: LibraryItem[] = [
  {
    id: '1',
    name: 'Marketing Flyer Design',
    type: 'template',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    dateCreated: '2024-06-15',
    dateModified: '2024-06-28',
    isStarred: true
  },
  {
    id: '2',
    name: 'Social Media Post Template',
    type: 'template',
    category: 'Social Media',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    dateCreated: '2024-06-10',
    dateModified: '2024-06-25',
    isStarred: false
  },
  {
    id: '3',
    name: 'Business Card Layout',
    type: 'template',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    dateCreated: '2024-06-05',
    dateModified: '2024-06-20',
    isStarred: true
  },
  {
    id: '4',
    name: 'Instagram Story Template',
    type: 'template',
    category: 'Social Media',
    thumbnail: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400&h=300&fit=crop',
    dateCreated: '2024-05-28',
    dateModified: '2024-06-15',
    isStarred: false
  },
  {
    id: '8',
    name: 'Event Poster Design',
    type: 'template',
    category: 'Events',
    thumbnail: 'https://images.unsplash.com/photo-1540749395716-7e2d4e9d7c0e?w=400&h=300&fit=crop',
    dateCreated: '2024-05-20',
    dateModified: '2024-06-10',
    isStarred: true
  },
  {
    id: '9',
    name: 'Newsletter Template',
    type: 'template',
    category: 'Marketing',
    thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    dateCreated: '2024-05-15',
    dateModified: '2024-06-05',
    isStarred: false
  },
  {
    id: '10',
    name: 'Presentation Template',
    type: 'template',
    category: 'Business',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    dateCreated: '2024-05-10',
    dateModified: '2024-06-01',
    isStarred: true
  },
  {
    id: '11',
    name: 'Book Cover Design',
    type: 'template',
    category: 'Publishing',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    dateCreated: '2024-05-05',
    dateModified: '2024-05-28',
    isStarred: false
  }
];

const mockRecentAssets: LibraryItem[] = [
  {
    id: '5',
    name: 'Company Logo Vector',
    type: 'element',
    category: 'Logos',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop',
    dateCreated: '2024-06-20',
    dateModified: '2024-06-28',
    isStarred: true,
    format: 'SVG'
  },
  {
    id: '6',
    name: 'Product Photo',
    type: 'image',
    category: 'Photos',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    dateCreated: '2024-06-18',
    dateModified: '2024-06-25',
    isStarred: false,
    format: 'PNG',
    size: '2.4 MB'
  },
  {
    id: '7',
    name: 'Custom Icons Set',
    type: 'element',
    category: 'Icons',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&h=200&fit=crop',
    dateCreated: '2024-06-12',
    dateModified: '2024-06-22',
    isStarred: false,
    format: 'SVG'
  },
  {
    id: '12',
    name: 'Brand Pattern Set',
    type: 'element',
    category: 'Patterns',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    dateCreated: '2024-06-08',
    dateModified: '2024-06-18',
    isStarred: true,
    format: 'SVG'
  },
  {
    id: '13',
    name: 'Texture Collection',
    type: 'image',
    category: 'Textures',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    dateCreated: '2024-06-03',
    dateModified: '2024-06-15',
    isStarred: false,
    format: 'JPG'
  },
  {
    id: '14',
    name: 'Illustration Set',
    type: 'element',
    category: 'Illustrations',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=200&fit=crop',
    dateCreated: '2024-05-30',
    dateModified: '2024-06-12',
    isStarred: true,
    format: 'SVG'
  }
];

export function UserLibraryModal({ isOpen, onClose, isMobile = false }: UserLibraryModalProps) {
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');

  const handleChatWithDesigner = () => {
    // Handle opening chat window
    // You would implement the actual chat functionality here
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'template': return <Grid3x3 className="w-4 h-4" />;
      case 'element': return <Shapes className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Folder className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const OptimizedLibraryGrid = ({ items }: { items: LibraryItem[] }) => (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3 lg:grid-cols-4'}`}>
      {items.map((item) => (
        <div key={item.id} className="group relative">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
            {/* Enhanced Thumbnail */}
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              
              {/* Enhanced Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0 shadow-sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Enhanced Type badge */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs py-1 px-2 h-6 flex items-center gap-1 shadow-sm">
                  {getItemIcon(item.type)}
                  <span className="capitalize">{item.type}</span>
                </Badge>
              </div>

              {/* Star indicator */}
              {item.isStarred && (
                <div className="absolute top-2 right-2">
                  <div className="bg-white/90 rounded-full p-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Content */}
            <div className="p-3">
              <h4 className="font-medium text-sm text-gray-900 mb-2 line-clamp-1">{item.name}</h4>
              <div className="text-xs text-gray-500 mb-1 capitalize">{item.category}</div>
              {(item.format || item.size) && (
                <div className="text-xs text-gray-400">
                  {item.format && <span>{item.format}</span>}
                  {item.format && item.size && <span> • </span>}
                  {item.size && <span>{item.size}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

//   const avatarImage = "blob:https://33c86982-c819-455d-a29b-66c7f55d2b8d-figmaiframepreview.figma.site/23d4469b-ffac-429d-b181-9ef69fe879a3#filename=8c79166971cb1aea3eacec3d6c81e3763364c51a.png"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`
          ${isMobile 
            ? 'w-[95vw] h-[85vh] max-w-none' 
            : 'w-[50vw] h-[75vh] max-w-none'
          } 
          p-0 
          overflow-hidden 
          fixed 
          left-[50%] 
          top-[50%] 
          translate-x-[-50%] 
          translate-y-[-50%]
          z-[9999]
          shadow-2xl
          border-0
        `}
        style={{
          width: isMobile ? '95vw' : '50vw',
          height: isMobile ? '85vh' : '75vh',
          maxWidth: 'none',
          maxHeight: 'none'
        }}
      >
        {/* Required Dialog Header for Accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>User Dashboard - {mockUserData.name}</DialogTitle>
          <DialogDescription>
            Manage your personal templates, assets, and account settings. View your content library and access designer support.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full w-full">
          {/* Enhanced Header with White Background */}
          <div className="p-6 pb-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {/* <img
                    // src="blob:https://33c86982-c819-455d-a29b-66c7f55d2b8d-figmaiframepreview.figma.site/23d4469b-ffac-429d-b181-9ef69fe879a3#filename=8c79166971cb1aea3eacec3d6c81e3763364c51a.png"
                    src={avatarImage}
                    alt="User avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  /> */}
                  <User  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md text-lg"/>
                  {mockUserData.plan === 'Pro' && (
                    <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1.5 border-2 border-white">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold text-gray-900 truncate">{mockUserData.name}</h2>
                    <Badge variant={mockUserData.plan === 'Pro' ? 'default' : 'secondary'} className="text-sm px-2 py-1 flex-shrink-0">
                      {mockUserData.plan}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1 truncate">{mockUserData.email}</p>
                  <p className="text-xs text-gray-500">Member since {formatDate(mockUserData.joinDate)}</p>
                </div>
              </div>
              
              {/* Enhanced Chat Button */}
              <Button 
                onClick={handleChatWithDesigner}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 flex-shrink-0"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {!isMobile && "Chat with a designer"}
                {isMobile && "Chat"}
              </Button>
            </div>

            {/* Simplified Stats Grid - Removed downloads/views */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center border border-gray-100 shadow-sm">
                <div className="text-lg font-semibold text-purple-600 mb-1">{mockUserData.templatesUploaded}</div>
                <div className="text-xs text-gray-600">Templates</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-gray-100 shadow-sm">
                <div className="text-lg font-semibold text-orange-600 mb-1">${mockUserData.earnings}</div>
                <div className="text-xs text-gray-600">Earnings</div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              {/* Enhanced Tab Navigation - Only 2 tabs */}
              <div className="px-6 pt-4 flex-shrink-0">
                <TabsList className="grid w-full grid-cols-2 h-11">
                  <TabsTrigger value="templates" className="flex items-center gap-2 text-sm font-medium">
                    <Grid3x3 className="w-4 h-4" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="assets" className="flex items-center gap-2 text-sm font-medium">
                    <Folder className="w-4 h-4" />
                    Assets
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Enhanced Tab Content */}
              <div className="flex-1 overflow-auto no-scrollbar px-6 pb-6 min-h-0">
                <TabsContent value="templates" className="mt-5 h-full">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5 flex-shrink-0">
                      <h3 className="text-lg font-medium text-gray-900">My Templates ({mockRecentTemplates.length})</h3>
                      <div className="flex gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-48 h-9"
                          />
                        </div>
                        <Button className="h-9 px-4 shadow-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          New Template
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto no-scrollbar">
                      <OptimizedLibraryGrid items={mockRecentTemplates} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assets" className="mt-5 h-full">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5 flex-shrink-0">
                      <h3 className="text-lg font-medium text-gray-900">My Assets ({mockRecentAssets.length})</h3>
                      <div className="flex gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-48 h-9"
                          />
                        </div>
                        <Button className="h-9 px-4 shadow-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Upload Asset
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto no-scrollbar">
                      <OptimizedLibraryGrid items={mockRecentAssets} />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Enhanced Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="h-9 px-4 shadow-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  {!isMobile && "Account Settings"}
                  {isMobile && "Settings"}
                </Button>
                <div className="text-sm text-gray-500 hidden sm:block">
                  Last updated: {formatDate(new Date().toISOString())}
                </div>
              </div>
              <Button variant="outline" onClick={onClose} className="h-9 px-6 shadow-sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}