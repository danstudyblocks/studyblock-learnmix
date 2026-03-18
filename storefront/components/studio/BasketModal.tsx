import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  quantity: number;
}

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketItems: BasketItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearBasket: () => void;
}

export function BasketModal({ 
  isOpen, 
  onClose, 
  basketItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearBasket 
}: BasketModalProps) {
  if (!isOpen) return null;

  const totalItems = basketItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = basketItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    // Here you would integrate with a payment system
    alert("Checkout functionality would be implemented here!");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9998] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Basket</h2>
              <p className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} • £{totalPrice.toFixed(2)} total
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
          {basketItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Your basket is empty</h3>
              <p className="text-gray-600">Add some print items to get started!</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {basketItems.map((item) => (
                <div key={`${item.id}-${item.quantity}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-blue-600">£{item.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">{item.unit}</span>
                    </div>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 min-w-[80px] text-right">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {basketItems.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onClearBasket}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Clear Basket
                </Button>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total ({totalItems} items)</p>
                <p className="text-2xl font-semibold text-gray-900">£{totalPrice.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Continue Shopping
              </Button>
              <Button onClick={handleCheckout} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Checkout
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Secure checkout • Free delivery on orders over £50 • Prices exclude VAT
            </p>
          </div>
        )}
      </div>
    </div>
  );
}