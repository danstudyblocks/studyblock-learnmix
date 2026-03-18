import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Palette,
  Square,
  Minus,
  Plus,
  RotateCcw,
  Pipette
} from "lucide-react";

interface ElementEditingToolbarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElementType?: 'text' | 'graphic' | null;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

export function ElementEditingToolbar({ isOpen, onClose }: ElementEditingToolbarProps) {
  const [fillColor, setFillColor] = useState("#3B82F6");
  const [outlineColor, setOutlineColor] = useState("#1F2937");
  const [outlineWidth, setOutlineWidth] = useState(2);
  const [opacity, setOpacity] = useState([100]);
  const [hasOutline, setHasOutline] = useState(true);
  const [isFillColorOpen, setIsFillColorOpen] = useState(false);
  const [isOutlineColorOpen, setIsOutlineColorOpen] = useState(false);
  
  const fillColorPickerRef = useRef<HTMLInputElement>(null);
  const outlineColorPickerRef = useRef<HTMLInputElement>(null);

  const extendedColors = [
    // Reds
    "#FEF2F2", "#FEE2E2", "#FECACA", "#FCA5A5", "#F87171", "#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D",
    // Oranges
    "#FFF7ED", "#FFEDD5", "#FED7AA", "#FDBA74", "#FB923C", "#F97316", "#EA580C", "#C2410C", "#9A3412", "#7C2D12",
    // Yellows
    "#FFFBEB", "#FEF3C7", "#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F",
    // Greens
    "#F0FDF4", "#DCFCE7", "#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A", "#15803D", "#166534", "#14532D",
    // Blues
    "#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A",
    // Purples
    "#FAF5FF", "#F3E8FF", "#E9D5FF", "#D8B4FE", "#C084FC", "#A855F7", "#9333EA", "#7C3AED", "#6D28D9", "#5B21B6",
    // Grays
    "#F9FAFB", "#F3F4F6", "#E5E7EB", "#D1D5DB", "#9CA3AF", "#6B7280", "#4B5563", "#374151", "#1F2937", "#111827"
  ];

  const handleOutlineWidthChange = (increment: number) => {
    const newWidth = Math.max(0, Math.min(20, outlineWidth + increment));
    setOutlineWidth(newWidth);
    if (newWidth > 0) {
      setHasOutline(true);
    }
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value);
  };

  const handleFillColorPickerClick = () => {
    fillColorPickerRef.current?.click();
  };

  const handleOutlineColorPickerClick = () => {
    outlineColorPickerRef.current?.click();
  };

  const handleFillColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFillColor(e.target.value);
  };

  const handleOutlineColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutlineColor(e.target.value);
  };

  const handleFillColorSelect = (color: string) => {
    setFillColor(color);
    setIsFillColorOpen(false);
  };

  const handleOutlineColorSelect = (color: string) => {
    setOutlineColor(color);
    setIsOutlineColorOpen(false);
  };

  const resetElement = () => {
    setFillColor("#3B82F6");
    setOutlineColor("#1F2937");
    setOutlineWidth(2);
    setOpacity([100]);
    setHasOutline(true);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-50 transition-all duration-300 ease-in-out">
      <div className="px-6 py-4">
        <div className="flex items-center gap-4 justify-start">
          {/* Fill Color */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 min-w-fit">Fill:</label>
            <Popover open={isFillColorOpen} onOpenChange={setIsFillColorOpen}>
              <PopoverTrigger asChild>
                <div 
                  className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  style={{ backgroundColor: fillColor }}
                />
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Fill Color</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleFillColorPickerClick}
                    >
                      <Pipette className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {/* Extended Color Grid */}
                  <div className="grid grid-cols-10 gap-1">
                    {extendedColors.map((color, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => handleFillColorSelect(color)}
                      />
                    ))}
                  </div>
                  
                  {/* Current Color Display */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div 
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: fillColor }}
                    />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Current Color</div>
                      <div className="text-sm font-mono">{fillColor}</div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <input
              ref={fillColorPickerRef}
              type="color"
              value={fillColor}
              onChange={handleFillColorChange}
              className="hidden"
            />
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Outline Controls */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 min-w-fit">Outline:</label>
            <Button
              variant={hasOutline ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setHasOutline(!hasOutline)}
            >
              <Square className="w-4 h-4" />
            </Button>
            {hasOutline && (
              <>
                <Popover open={isOutlineColorOpen} onOpenChange={setIsOutlineColorOpen}>
                  <PopoverTrigger asChild>
                    <div 
                      className="w-6 h-6 rounded border-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      style={{ backgroundColor: outlineColor }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Outline Color</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={handleOutlineColorPickerClick}
                        >
                          <Pipette className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {/* Extended Color Grid */}
                      <div className="grid grid-cols-10 gap-1">
                        {extendedColors.map((color, index) => (
                          <button
                            key={index}
                            className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleOutlineColorSelect(color)}
                          />
                        ))}
                      </div>
                      
                      {/* Current Color Display */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <div 
                          className="w-8 h-8 rounded border-2 border-gray-300"
                          style={{ backgroundColor: outlineColor }}
                        />
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">Current Color</div>
                          <div className="text-sm font-mono">{outlineColor}</div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOutlineWidthChange(-1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <div className="w-8 h-8 bg-gray-50 rounded border flex items-center justify-center">
                    <span className="text-sm font-medium">{outlineWidth}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOutlineWidthChange(1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                <input
                  ref={outlineColorPickerRef}
                  type="color"
                  value={outlineColor}
                  onChange={handleOutlineColorChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Opacity Slider */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 min-w-fit">Opacity:</label>
            <div className="flex items-center gap-2">
              <Slider
                value={opacity}
                onValueChange={handleOpacityChange}
                max={100}
                min={0}
                step={5}
                className="w-24"
              />
              <div className="w-12 h-8 bg-gray-50 rounded border flex items-center justify-center">
                <span className="text-sm font-medium">{opacity[0]}%</span>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3"
            onClick={resetElement}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}