import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Monitor, FileText, Presentation, Mail, Circle } from "lucide-react";

interface CanvasDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

interface CanvasSize {
  id: string;
  name: string;
  dimensions: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  category: 'print' | 'digital' | 'marketing';
}

const canvasSizes: CanvasSize[] = [
  // Print sizes
  { id: 'a4', name: 'A4', dimensions: '210 × 297 mm', width: 210, height: 297, icon: <FileText className="w-4 h-4" />, category: 'print' },
  { id: 'a3', name: 'A3', dimensions: '297 × 420 mm', width: 297, height: 420, icon: <FileText className="w-4 h-4" />, category: 'print' },
  { id: 'a2', name: 'A2', dimensions: '420 × 594 mm', width: 420, height: 594, icon: <FileText className="w-4 h-4" />, category: 'print' },
  { id: 'letter', name: 'Letter', dimensions: '8.5 × 11 in', width: 216, height: 279, icon: <FileText className="w-4 h-4" />, category: 'print' },
  
  // Digital sizes
  { id: 'powerpoint', name: 'PowerPoint', dimensions: '1920 × 1080 px', width: 1920, height: 1080, icon: <Presentation className="w-4 h-4" />, category: 'digital' },
  { id: 'desktop', name: 'Desktop', dimensions: '1920 × 1080 px', width: 1920, height: 1080, icon: <Monitor className="w-4 h-4" />, category: 'digital' },
  { id: 'mobile', name: 'Mobile', dimensions: '375 × 812 px', width: 375, height: 812, icon: <Monitor className="w-4 h-4" />, category: 'digital' },
  
  // Marketing sizes
  { id: 'postcard', name: 'Postcard', dimensions: '148 × 105 mm', width: 148, height: 105, icon: <Mail className="w-4 h-4" />, category: 'marketing' },
  { id: 'sticker', name: 'Sticker', dimensions: '100 × 100 mm', width: 100, height: 100, icon: <Circle className="w-4 h-4" />, category: 'marketing' },
  { id: 'businesscard', name: 'Business Card', dimensions: '85 × 55 mm', width: 85, height: 55, icon: <Mail className="w-4 h-4" />, category: 'marketing' },
];

export function CanvasDropdown({ isOpen, onClose }: CanvasDropdownProps) {
  const [selectedSize, setSelectedSize] = useState<string>('a4');
  const [activeCategory, setActiveCategory] = useState<'all' | 'print' | 'digital' | 'marketing'>('all');

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    // Here you would typically apply the canvas size change
  };

  const filteredSizes = canvasSizes.filter(size => 
    activeCategory === 'all' || size.category === activeCategory
  );

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-50" style={{ height: '33vh' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <h3 className="font-medium text-gray-900">Canvas Size</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('all')}
                className="h-8"
              >
                All
              </Button>
              <Button
                variant={activeCategory === 'print' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('print')}
                className="h-8"
              >
                Print
              </Button>
              <Button
                variant={activeCategory === 'digital' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('digital')}
                className="h-8"
              >
                Digital
              </Button>
              <Button
                variant={activeCategory === 'marketing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('marketing')}
                className="h-8"
              >
                Marketing
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Canvas sizes grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSizeSelect(size.id)}
                className={`group p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  selectedSize === size.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    selectedSize === size.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    {size.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm text-gray-900">{size.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{size.dimensions}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}