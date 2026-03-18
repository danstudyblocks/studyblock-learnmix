import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Eye, EyeOff, Lock, Unlock, GripVertical, Square, Type, Circle } from "lucide-react";

interface LayersDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image';
  visible: boolean;
  locked: boolean;
  order: number;
}

const initialLayers: Layer[] = [
  { id: 'layer1', name: 'Sample Text Box', type: 'text', visible: true, locked: false, order: 4 },
  { id: 'layer2', name: 'Green Circle', type: 'shape', visible: true, locked: false, order: 3 },
  { id: 'layer3', name: 'Red Rectangle', type: 'shape', visible: true, locked: false, order: 2 },
  { id: 'layer4', name: 'Click to Edit Text', type: 'text', visible: true, locked: false, order: 1 },
  { id: 'layer5', name: 'Purple Bar', type: 'shape', visible: true, locked: false, order: 0 },
];

export function LayersDropdown({ isOpen, onClose }: LayersDropdownProps) {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);

  const toggleVisibility = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLock = (layerId: string) => {
    setLayers(layers.map(layer => 
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    setDraggedLayer(layerId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    
    if (!draggedLayer || draggedLayer === targetLayerId) {
      setDraggedLayer(null);
      return;
    }

    const draggedIndex = layers.findIndex(layer => layer.id === draggedLayer);
    const targetIndex = layers.findIndex(layer => layer.id === targetLayerId);
    
    const newLayers = [...layers];
    const draggedLayerData = newLayers[draggedIndex];
    
    // Remove dragged layer and insert at target position
    newLayers.splice(draggedIndex, 1);
    newLayers.splice(targetIndex, 0, draggedLayerData);
    
    // Update order values
    const updatedLayers = newLayers.map((layer, index) => ({
      ...layer,
      order: newLayers.length - 1 - index
    }));
    
    setLayers(updatedLayers);
    setDraggedLayer(null);
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'shape':
        return <Square className="w-4 h-4" />;
      case 'image':
        return <Circle className="w-4 h-4" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  const sortedLayers = [...layers].sort((a, b) => b.order - a.order);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-50" style={{ height: '33vh' }}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-medium text-gray-900">Layers</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Layers list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {sortedLayers.map((layer) => (
              <div
                key={layer.id}
                draggable={!layer.locked}
                onDragStart={(e) => handleDragStart(e, layer.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, layer.id)}
                className={`group flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-move ${
                  draggedLayer === layer.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                } ${layer.locked ? 'cursor-not-allowed opacity-75' : ''}`}
              >
                {/* Drag handle */}
                <div className="text-gray-400 group-hover:text-gray-600">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Layer icon */}
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  layer.type === 'text' ? 'bg-blue-100 text-blue-600' :
                  layer.type === 'shape' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {getLayerIcon(layer.type)}
                </div>

                {/* Layer name */}
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm text-gray-900">{layer.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{layer.type}</div>
                </div>

                {/* Layer controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleVisibility(layer.id)}
                  >
                    {layer.visible ? (
                      <Eye className="w-4 h-4 text-gray-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleLock(layer.id)}
                  >
                    {layer.locked ? (
                      <Lock className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {layers.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Square className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg mb-2">No layers found</p>
              <p className="text-sm">Add some elements to your canvas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}