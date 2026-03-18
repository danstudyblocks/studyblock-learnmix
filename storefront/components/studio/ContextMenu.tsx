import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  X,
  Type,
  Palette
} from "lucide-react";

interface CanvasElement {
  id: string;
  type: 'text' | 'graphic';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  textType?: 'heading' | 'body';
  graphicType?: 'rectangle' | 'circle' | 'star' | 'triangle' | 'image';
  color?: string;
  fontSize?: number;
  lineHeight?: number;
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  selectedElementId: string | null;
  selectedElement: CanvasElement | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClose: () => void;
  onMoveUp: (elementId: string) => void;
  onMoveDown: (elementId: string) => void;
  onDuplicate: (elementId: string) => void;
  onDelete: (elementId: string) => void;
  onAlignLeft: (elementId: string) => void;
  onAlignCenter: (elementId: string) => void;
  onAlignRight: (elementId: string) => void;
  onUpdateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
}

const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72];
const fontFamilies = ['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Helvetica', 'Comic Sans MS'];

// Helper function to convert hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// Helper function to convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number): string => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate 5 complementary colors based on the current color
function generateComplementaryColors(baseColor: string): string[] {
  // Handle edge cases
  if (!baseColor || baseColor === '#ffffff') {
    return ['#000000', '#333333', '#666666', '#999999', '#cccccc'];
  }
  if (baseColor === '#000000') {
    return ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'];
  }

  try {
    const [h, s, l] = hexToHsl(baseColor);
    
    const colors: string[] = [];
    
    // 1. Current color (or a slight variation to ensure it's included)
    colors.push(baseColor);
    
    // 2. Analogous color 1 (30 degrees clockwise)
    const analogous1 = hslToHex((h + 30) % 360, s, l);
    colors.push(analogous1);
    
    // 3. Analogous color 2 (30 degrees counter-clockwise)
    const analogous2 = hslToHex((h - 30 + 360) % 360, s, l);
    colors.push(analogous2);
    
    // 4. Complementary color (180 degrees opposite)
    const complementary = hslToHex((h + 180) % 360, s, l);
    colors.push(complementary);
    
    // 5. Triadic color (120 degrees)
    const triadic = hslToHex((h + 120) % 360, s, l);
    colors.push(triadic);

    return colors;
  } catch (error) {
    // Fallback to neutral colors if color parsing fails
    return ['#000000', '#333333', '#666666', '#999999', '#cccccc'];
  }
}

export function ContextMenu({
  isOpen,
  position,
  selectedElementId,
  selectedElement,
  canMoveUp,
  canMoveDown,
  onClose,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onUpdateElement
}: ContextMenuProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [localFontSize, setLocalFontSize] = useState<number>(16);
  const [localColor, setLocalColor] = useState<string>('#000000');

  // Generate complementary colors based on the selected element's current color
  const complementaryColors = selectedElement?.color 
    ? generateComplementaryColors(selectedElement.color)
    : ['#000000', '#333333', '#666666', '#999999', '#cccccc'];

  // Update local state when selectedElement changes
  useEffect(() => {
    if (selectedElement) {
      setLocalFontSize(selectedElement.fontSize || 16);
      setLocalColor(selectedElement.color || '#000000');
    }
  }, [selectedElement]);

  // Handle click outside to close context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle menu positioning to keep it within viewport
  const getMenuStyle = () => {
    if (!isOpen) return { display: 'none' };

    const menuWidth = 220;
    const menuHeight = selectedElement?.type === 'text' ? 420 : 350; // Reduced back to original height
    const padding = 10;

    let x = position.x;
    let y = position.y;

    // Adjust horizontal position if menu would go off-screen
    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }

    // Adjust vertical position if menu would go off-screen
    if (y + menuHeight > window.innerHeight - padding) {
      y = window.innerHeight - menuHeight - padding;
    }
    if (y < padding) {
      y = padding;
    }

    return {
      position: 'fixed' as const,
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 1000,
    };
  };

  if (!isOpen || !selectedElementId || !selectedElement) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  const handleFontSizeChange = (newSize: number) => {
    setLocalFontSize(newSize);
    onUpdateElement(selectedElementId, { fontSize: newSize });
  };

  const handleColorChange = (newColor: string) => {
    setLocalColor(newColor);
    onUpdateElement(selectedElementId, { color: newColor });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    // For now, we'll just store this as a style property
    // In a real implementation, you'd need to add fontFamily to your CanvasElement interface
  };

  return (
    <div
      ref={contextMenuRef}
      className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden min-w-[220px] animate-in fade-in-0 zoom-in-95 duration-200"
      style={getMenuStyle()}
    >
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Element Tools</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-blue-100"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Editing Tools Section */}
      <div className="p-3 border-b border-gray-100">
        <div className="text-xs font-medium text-gray-500 mb-3 flex items-center">
          <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
          {selectedElement.type === 'text' ? 'Text Formatting' : 'Appearance'}
        </div>

        {selectedElement.type === 'text' ? (
          // Text Editing Tools
          <div className="space-y-3">
            {/* Font Family */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Family</label>
              <Select defaultValue="Inter" onValueChange={handleFontFamilyChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Font Size</label>
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" />
                <Select value={localFontSize.toString()} onValueChange={(value) => handleFontSizeChange(parseInt(value))}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}px
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block">Text Color</label>
              <div className="flex gap-2 justify-between">
                {complementaryColors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    className={`w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${
                      localColor === color ? 'border-gray-800 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Graphic Editing Tools
          <div className="space-y-3">
            {/* Color */}
            <div>
              <label className="text-xs text-gray-600 mb-2 block flex items-center">
                <Palette className="w-3 h-3 mr-1" />
                Color
              </label>
              <div className="flex gap-2 justify-between">
                {complementaryColors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    className={`w-9 h-9 rounded-lg border-2 transition-all hover:scale-110 ${
                      localColor === color ? 'border-gray-800 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layer Order Controls */}
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          Layer Order
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm hover:bg-blue-50 transition-colors"
            disabled={!canMoveUp}
            onClick={() => handleAction(() => onMoveUp(selectedElementId))}
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Move Up
            {!canMoveUp && <span className="ml-auto text-xs text-gray-400">(Top)</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm hover:bg-blue-50 transition-colors"
            disabled={!canMoveDown}
            onClick={() => handleAction(() => onMoveDown(selectedElementId))}
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            Move Down
            {!canMoveDown && <span className="ml-auto text-xs text-gray-400">(Bottom)</span>}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Element Actions */}
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Actions
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm hover:bg-green-50 transition-colors"
            onClick={() => handleAction(() => onDuplicate(selectedElementId))}
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            onClick={() => handleAction(() => onDelete(selectedElementId))}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Separator />

      {/* Alignment Controls */}
      <div className="p-2">
        <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center">
          <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
          Align to Canvas
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm hover:bg-purple-50 transition-colors"
            onClick={() => handleAction(() => onAlignLeft(selectedElementId))}
          >
            <AlignLeft className="w-4 h-4 mr-2" />
            Align Left
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm hover:bg-purple-50 transition-colors"
            onClick={() => handleAction(() => onAlignCenter(selectedElementId))}
          >
            <AlignCenter className="w-4 h-4 mr-2" />
            Align Center
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start h-8 px-2 text-sm hover:bg-purple-50 transition-colors"
            onClick={() => handleAction(() => onAlignRight(selectedElementId))}
          >
            <AlignRight className="w-4 h-4 mr-2" />
            Align Right
          </Button>
        </div>
      </div>

      {/* Hint footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
        <span className="text-xs text-gray-500">Press ESC to close</span>
      </div>
    </div>
  );
}