import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Square, Smile, Image, Palette, X } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

interface ElementsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToBasket?: (item: BasketItem) => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

interface BasketItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  quantity: number;
}

type ElementCategory = 'shapes' | 'icons' | 'graphics' | 'photos';

interface Element {
  id: string;
  title: string;
  category: ElementCategory;
  imageUrl: string;
  type: 'shape' | 'icon' | 'graphic' | 'photo';
}

const mockElements: Element[] = [
  // Shapes - 27 items
  { id: '1', title: 'Circle', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'shape' },
  { id: '2', title: 'Rectangle', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'shape' },
  { id: '3', title: 'Triangle', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'shape' },
  { id: '4', title: 'Star', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=400&fit=crop', type: 'shape' },
  { id: '5', title: 'Polygon', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'shape' },
  { id: '6', title: 'Heart', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'shape' },
  { id: '31', title: 'Diamond', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'shape' },
  { id: '32', title: 'Hexagon', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=400&fit=crop', type: 'shape' },
  { id: '33', title: 'Oval', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'shape' },
  { id: '34', title: 'Arrow', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'shape' },
  { id: '35', title: 'Cross', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'shape' },
  { id: '36', title: 'Crescent', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=400&fit=crop', type: 'shape' },
  { id: '55', title: 'Octagon', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'shape' },
  { id: '56', title: 'Pentagon', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'shape' },
  { id: '57', title: 'Rhombus', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'shape' },
  { id: '58', title: 'Trapezoid', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=400&fit=crop', type: 'shape' },
  { id: '59', title: 'Parallelogram', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'shape' },
  { id: '60', title: 'Kite', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'shape' },
  { id: '61', title: 'Spiral', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'shape' },
  { id: '62', title: 'Lightning', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=400&fit=crop', type: 'shape' },
  { id: '63', title: 'Cloud', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'shape' },
  { id: '64', title: 'Burst', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'shape' },
  { id: '65', title: 'Wave', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'shape' },
  { id: '66', title: 'Flower', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&h=400&fit=crop', type: 'shape' },
  { id: '67', title: 'Leaf', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'shape' },
  { id: '68', title: 'Shield', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'shape' },
  { id: '69', title: 'Badge', category: 'shapes', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'shape' },

  // Icons - 27 items
  { id: '7', title: 'Home Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', type: 'icon' },
  { id: '8', title: 'User Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', type: 'icon' },
  { id: '9', title: 'Settings Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop', type: 'icon' },
  { id: '10', title: 'Search Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'icon' },
  { id: '11', title: 'Arrow Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'icon' },
  { id: '12', title: 'Heart Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'icon' },
  { id: '37', title: 'Mail Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', type: 'icon' },
  { id: '38', title: 'Phone Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', type: 'icon' },
  { id: '39', title: 'Calendar Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop', type: 'icon' },
  { id: '40', title: 'Chat Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'icon' },
  { id: '41', title: 'Shopping Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'icon' },
  { id: '42', title: 'Music Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'icon' },
  { id: '70', title: 'Camera Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', type: 'icon' },
  { id: '71', title: 'Video Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', type: 'icon' },
  { id: '72', title: 'Location Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop', type: 'icon' },
  { id: '73', title: 'Lock Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'icon' },
  { id: '74', title: 'Key Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'icon' },
  { id: '75', title: 'Clock Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'icon' },
  { id: '76', title: 'Bell Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', type: 'icon' },
  { id: '77', title: 'Star Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', type: 'icon' },
  { id: '78', title: 'Flag Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop', type: 'icon' },
  { id: '79', title: 'Download Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', type: 'icon' },
  { id: '80', title: 'Upload Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop', type: 'icon' },
  { id: '81', title: 'Share Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop', type: 'icon' },
  { id: '82', title: 'Like Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', type: 'icon' },
  { id: '83', title: 'Comment Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', type: 'icon' },
  { id: '84', title: 'Bookmark Icon', category: 'icons', imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop', type: 'icon' },

  // Graphics - 27 items
  { id: '13', title: 'Abstract Pattern', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '14', title: 'Geometric Design', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '15', title: 'Gradient Blob', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '16', title: 'Line Art', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '17', title: 'Decorative Border', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '18', title: 'Ornamental Frame', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '43', title: 'Mandala Pattern', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '44', title: 'Watercolor Splash', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '45', title: 'Tech Circuit', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '46', title: 'Floral Motif', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '47', title: 'Vintage Badge', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '48', title: 'Modern Logo', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '85', title: 'Tribal Pattern', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '86', title: 'Celtic Knot', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '87', title: 'Art Deco Frame', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '88', title: 'Digital Texture', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '89', title: 'Brush Stroke', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '90', title: 'Marble Texture', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '91', title: 'Neon Glow', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '92', title: 'Paper Cut', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '93', title: 'Grunge Effect', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '94', title: 'Hologram', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '95', title: 'Pixel Art', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '96', title: 'Vector Art', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '97', title: 'Sketch Style', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '98', title: 'Gradient Mesh', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop', type: 'graphic' },
  { id: '99', title: 'Stained Glass', category: 'graphics', imageUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=400&fit=crop', type: 'graphic' },

  // Photos - 27 items
  { id: '19', title: 'Nature Landscape', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', type: 'photo' },
  { id: '20', title: 'Business Team', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop', type: 'photo' },
  { id: '21', title: 'Technology', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop', type: 'photo' },
  { id: '22', title: 'Food & Drink', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', type: 'photo' },
  { id: '23', title: 'Architecture', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', type: 'photo' },
  { id: '24', title: 'Abstract Art', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', type: 'photo' },
  { id: '49', title: 'Urban Street', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop', type: 'photo' },
  { id: '50', title: 'Ocean Waves', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop', type: 'photo' },
  { id: '51', title: 'Mountain Peak', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=400&fit=crop', type: 'photo' },
  { id: '52', title: 'City Skyline', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop', type: 'photo' },
  { id: '53', title: 'Forest Path', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', type: 'photo' },
  { id: '54', title: 'Workspace', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop', type: 'photo' },
  { id: '100', title: 'Desert Sunset', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', type: 'photo' },
  { id: '101', title: 'Coffee Shop', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop', type: 'photo' },
  { id: '102', title: 'Modern Art', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop', type: 'photo' },
  { id: '103', title: 'Street Food', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', type: 'photo' },
  { id: '104', title: 'Glass Building', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', type: 'photo' },
  { id: '105', title: 'Garden Flowers', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop', type: 'photo' },
  { id: '106', title: 'Night Market', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop', type: 'photo' },
  { id: '107', title: 'Beach Sunset', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop', type: 'photo' },
  { id: '108', title: 'Snow Mountain', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=400&fit=crop', type: 'photo' },
  { id: '109', title: 'Night City', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=400&fit=crop', type: 'photo' },
  { id: '110', title: 'Autumn Forest', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop', type: 'photo' },
  { id: '111', title: 'Creative Studio', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop', type: 'photo' },
  { id: '112', title: 'Vintage Car', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', type: 'photo' },
  { id: '113', title: 'Fashion Model', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop', type: 'photo' },
  { id: '114', title: 'Space Nebula', category: 'photos', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop', type: 'photo' }
];

export function ElementsDropdown({ isOpen, onClose, isMobile = false, screenSize = 'desktop' }: ElementsDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('shapes');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCategoryChange = (category: ElementCategory) => {
    if (category === activeCategory) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 150);
  };

  const filteredElements = mockElements.filter(element => {
    const matchesSearch = element.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && element.category === activeCategory;
  });

  if (!isOpen) return null;

  // Mobile full-screen positioning
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-dropdown overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Elements</h3>
                <p className="text-sm text-gray-500">Shapes &amp; graphics</p>
              </div>
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

          {/* Mobile Search */}
          <div className="p-4 border-b border-border bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search elements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Mobile Filter buttons */}
          <div className="flex items-center gap-2 p-4 border-b border-border bg-white overflow-x-auto">
            <Button
              variant={activeCategory === 'shapes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('shapes')}
              className="h-10 whitespace-nowrap"
            >
              <Square className="w-4 h-4 mr-2" />
              Shapes
            </Button>
            <Button
              variant={activeCategory === 'icons' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('icons')}
              className="h-10 whitespace-nowrap"
            >
              <Smile className="w-4 h-4 mr-2" />
              Icons
            </Button>
            <Button
              variant={activeCategory === 'graphics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('graphics')}
              className="h-10 whitespace-nowrap"
            >
              <Palette className="w-4 h-4 mr-2" />
              Graphics
            </Button>
            <Button
              variant={activeCategory === 'photos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('photos')}
              className="h-10 whitespace-nowrap"
            >
              <Image className="w-4 h-4 mr-2" />
              Photos
            </Button>
          </div>

          {/* Mobile Elements Grid - Square cards */}
          <div className="flex-1 overflow-hidden p-4">
            <div className={`h-full transition-all duration-150 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto">
                {filteredElements.map((element) => (
                  <div
                    key={element.id}
                    className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden h-fit"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <ImageWithFallback
                        src={element.imageUrl}
                        alt={element.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900 truncate mb-2">{element.title}</h4>
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded text-xs capitalize ${
                          element.type === 'shape' ? 'bg-blue-100 text-blue-600' :
                          element.type === 'icon' ? 'bg-green-100 text-green-600' :
                          element.type === 'graphic' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {element.type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {filteredElements.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg mb-2">No elements found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop positioning - Square cards, twice as big, unified scroll
  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-dropdown" style={{ height: '50vh' }}>
      <div className="h-full flex flex-col">
        {/* Header with search and close button */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search elements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-4">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <Button
            variant={activeCategory === 'shapes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('shapes')}
            className="h-8"
          >
            <Square className="w-4 h-4 mr-2" />
            Shapes
          </Button>
          <Button
            variant={activeCategory === 'icons' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('icons')}
            className="h-8"
          >
            <Smile className="w-4 h-4 mr-2" />
            Icons
          </Button>
          <Button
            variant={activeCategory === 'graphics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('graphics')}
            className="h-8"
          >
            <Palette className="w-4 h-4 mr-2" />
            Graphics
          </Button>
          <Button
            variant={activeCategory === 'photos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange('photos')}
            className="h-8"
          >
            <Image className="w-4 h-4 mr-2" />
            Photos
          </Button>
        </div>

        {/* Elements unified scroll - Two rows, square cards, twice as big */}
        <div className="flex-1 overflow-hidden p-4">
          <div className={`h-full transition-all duration-150 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="overflow-x-auto overflow-y-hidden h-full pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="grid grid-rows-2 grid-flow-col gap-4 h-full" style={{ width: 'max-content' }}>
                {filteredElements.map((element, index) => (
                  <div
                    key={element.id}
                    className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden w-56 h-full"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <ImageWithFallback
                        src={element.imageUrl}
                        alt={element.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-base text-gray-900 leading-tight mb-2 truncate">{element.title}</h4>
                      <div className="flex items-center">
                        <div className={`px-3 py-1.5 rounded text-sm capitalize whitespace-nowrap ${
                          element.type === 'shape' ? 'bg-blue-100 text-blue-600' :
                          element.type === 'icon' ? 'bg-green-100 text-green-600' :
                          element.type === 'graphic' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {element.type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {filteredElements.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg mb-2">No elements found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}