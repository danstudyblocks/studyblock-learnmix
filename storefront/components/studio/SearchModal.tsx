import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Layout, Shapes, Grid3x3, Plus } from "lucide-react";
import { ImageWithFallback } from "@/components/studio/ImageWithFallback";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  isMobile?: boolean;
}

interface SearchItem {
  id: string;
  name: string;
  category: 'template' | 'icon' | 'block';
  description?: string; // Optional for icons
  tags: string[];
  imageUrl?: string;
  iconComponent?: React.ComponentType<{ className?: string }>;
  isPro?: boolean;
}

// Mock data for demonstration
const mockSearchItems: SearchItem[] = [
  // Templates
  {
    id: 'template-1',
    name: 'Modern Business Card',
    category: 'template',
    description: 'Professional business card template with clean design',
    tags: ['business', 'card', 'professional', 'modern'],
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop',
    isPro: false
  },
  {
    id: 'template-2',
    name: 'Social Media Post',
    category: 'template',
    description: 'Eye-catching social media post template',
    tags: ['social', 'media', 'post', 'instagram'],
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    isPro: true
  },
  {
    id: 'template-3',
    name: 'Educational Worksheet',
    category: 'template',
    description: 'Interactive learning worksheet for students',
    tags: ['education', 'worksheet', 'learning', 'students'],
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
    isPro: false
  },
  // Icons (no descriptions)
  {
    id: 'icon-1',
    name: 'Star Icon',
    category: 'icon',
    tags: ['star', 'rating', 'favorite', 'award'],
    iconComponent: () => <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>,
    isPro: false
  },
  {
    id: 'icon-2',
    name: 'Heart Icon',
    category: 'icon',
    tags: ['heart', 'love', 'like', 'favorite'],
    iconComponent: () => <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>,
    isPro: false
  },
  {
    id: 'icon-3',
    name: 'Download Icon',
    category: 'icon',
    tags: ['download', 'arrow', 'file', 'save'],
    iconComponent: () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    isPro: true
  },
  // Blocks
  {
    id: 'block-1',
    name: 'Header Block',
    category: 'block',
    description: 'Navigation header with logo and menu items',
    tags: ['header', 'navigation', 'menu', 'logo'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=150&fit=crop',
    isPro: false
  },
  {
    id: 'block-2',
    name: 'Feature Card',
    category: 'block',
    description: 'Product feature card with icon and description',
    tags: ['card', 'feature', 'product', 'description'],
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=150&fit=crop',
    isPro: true
  },
  {
    id: 'block-3',
    name: 'Call to Action',
    category: 'block',
    description: 'Compelling CTA section with button and text',
    tags: ['cta', 'button', 'action', 'conversion'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=150&fit=crop',
    isPro: false
  }
];

export function SearchModal({ isOpen, onClose, searchTerm, onSearchTermChange, isMobile = false }: SearchModalProps) {
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>(mockSearchItems);
  const [activeCategory, setActiveCategory] = useState<'all' | 'template' | 'icon' | 'block'>('all');

  // Filter items based on search term and category
  useEffect(() => {
    let items = mockSearchItems;

    // Filter by category
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        item.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    setFilteredItems(items);
  }, [searchTerm, activeCategory]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'template', label: 'Templates', icon: Layout },
    { id: 'icon', label: 'Icons', icon: Shapes },
    { id: 'block', label: 'Blocks', icon: Grid3x3 }
  ];

  const handleItemClick = (item: SearchItem) => {
    // Handle item selection logic here
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-start justify-center pt-4 sm:pt-8">
      <div className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col ${isMobile ? 'h-[90vh]' : 'h-[80vh]'}`}>
        {/* Header */}
        <div className="flex items-center gap-4 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search templates, icons, blocks..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 pr-4 h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-4 sm:p-6 pb-4 border-b border-gray-100">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(category.id as any)}
                className={`h-9 px-4 ${isActive ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="text-sm">{category.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browse categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-purple-300"
                  onClick={() => handleItemClick(item)}
                >
                  {/* Item Preview */}
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                    {item.imageUrl ? (
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : item.iconComponent ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <item.iconComponent className="w-12 h-12 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid3x3 className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${
                        item.category === 'template' ? 'bg-blue-500' :
                        item.category === 'icon' ? 'bg-green-500' : 'bg-pink-500'
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Pro Badge */}
                    {item.isPro && (
                      <div className="absolute top-2 right-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">
                          PRO
                        </span>
                      </div>
                    )}

                    {/* Add Button */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="h-8 w-8 p-0 bg-white shadow-lg hover:bg-purple-50 border border-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                      >
                        <Plus className="w-4 h-4 text-purple-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">{item.name}</h4>
                    {/* Only show description for templates and blocks, not icons */}
                    {item.description && item.category !== 'icon' && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found
            </span>
            <span>
              Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}