import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Printer, ShoppingCart, X } from "lucide-react";

interface PrintItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  icon: typeof Printer;
}

interface BasketItem extends PrintItem {
  quantity: number;
}

interface PrintDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToBasket: (item: BasketItem) => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

export function PrintDropdown({ isOpen, onClose, onAddToBasket, isMobile = false, screenSize = 'desktop' }: PrintDropdownProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const printItems: PrintItem[] = [
    {
      id: "a1-poster",
      name: "A1 Poster",
      price: 7.95,
      unit: "each",
      description: "594 × 841 mm premium poster",
      icon: Printer
    },
    {
      id: "a2-poster", 
      name: "A2 Poster",
      price: 5.00,
      unit: "each",
      description: "420 × 594 mm high-quality poster",
      icon: Printer
    },
    {
      id: "a3-poster",
      name: "A3+ Poster", 
      price: 3.95,
      unit: "each",
      description: "329 × 483 mm compact poster",
      icon: Printer
    },
    {
      id: "stickers",
      name: "Stickers",
      price: 5.95,
      unit: "per 100",
      description: "Custom vinyl stickers (pack of 100)",
      icon: Printer
    },
    {
      id: "postcards",
      name: "Postcards",
      price: 25.00,
      unit: "per 100", 
      description: "Premium postcards (pack of 100)",
      icon: Printer
    }
  ];

  const getQuantity = (itemId: string) => quantities[itemId] || 1;

  const updateQuantity = (itemId: string, change: number) => {
    const currentQuantity = getQuantity(itemId);
    const newQuantity = Math.max(1, currentQuantity + change);
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const handleAddToBasket = (item: PrintItem) => {
    const quantity = getQuantity(item.id);
    const basketItem: BasketItem = {
      ...item,
      quantity
    };
    onAddToBasket(basketItem);
    
    // Reset quantity after adding to basket
    setQuantities(prev => ({
      ...prev,
      [item.id]: 1
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white border-b border-border">
      <div className="px-6 py-6">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Order Print</h3>
              <p className="text-sm text-gray-600">Professional printing services with fast delivery</p>
            </div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Print Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {printItems.map((item) => {
            const quantity = getQuantity(item.id);
            const totalPrice = item.price * quantity;
            
            return (
              <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-white hover:shadow-md transition-all duration-200">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Printer className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-lg font-bold text-blue-600">£{item.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">{item.unit}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">Qty:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center font-medium py-2">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-r-lg"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="text-center mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    £{totalPrice.toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-500">Total</p>
                </div>

                {/* Add to Basket Button */}
                <Button
                  onClick={() => handleAddToBasket(item)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Basket
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            High-quality printing with fast delivery
          </p>
          <p className="text-xs text-gray-500">
            All prices exclude VAT • Free delivery on orders over £50
          </p>
        </div>
      </div>
    </div>
  );
}