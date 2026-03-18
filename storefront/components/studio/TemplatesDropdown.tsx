import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, TrendingUp, X, Layout, BookOpen, Calculator, Beaker, Globe, Paintbrush, Music, Dumbbell, Code, Languages } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { BasketItem } from "./BasketModal";

// Educational template image service with proper licensing
const educationalImageService = {
  // Math & Mathematics
  math: [
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop&auto=format', // Equations on blackboard
    'https://images.unsplash.com/photo-1509228627152-72ae4c67dbaa?w=400&h=400&fit=crop&auto=format', // Math formulas
    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=400&fit=crop&auto=format', // Geometry tools
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=400&fit=crop&auto=format', // Calculator and graphs
  ],
  // Science & Laboratory
  science: [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop&auto=format', // Laboratory equipment
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop&auto=format', // Microscope
    'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&h=400&fit=crop&auto=format', // Chemistry lab
    'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=400&fit=crop&auto=format', // Scientific instruments
  ],
  // English & Literature
  english: [
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop&auto=format', // Open books
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&auto=format', // Writing and books
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop&auto=format', // Dictionary and pen
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format', // Typewriter
  ],
  // History & Social Studies
  history: [
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop&auto=format', // Ancient scrolls
    'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=400&h=400&fit=crop&auto=format', // Historical documents
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&auto=format', // Old maps
    'https://images.unsplash.com/photo-1485175439456-d61100ae96ba?w=400&h=400&fit=crop&auto=format', // Historical artifacts
  ],
  // Geography & Earth Science
  geography: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format', // World map
    'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=400&fit=crop&auto=format', // Globe
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&auto=format', // Compass and maps
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&auto=format', // Earth from space
  ],
  // Art & Creative
  art: [
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&auto=format', // Art supplies
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&auto=format', // Paint palette
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&auto=format', // Drawing tools
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=400&fit=crop&auto=format', // Canvas and brushes
  ],
  // Music & Performance
  music: [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format', // Sheet music
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop&auto=format', // Piano keys
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format', // Musical instruments
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop&auto=format', // Music notes
  ],
  // Physical Education & Health
  pe: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format', // Exercise equipment
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop&auto=format', // Sports field
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&auto=format', // Fitness tracking
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&fit=crop&auto=format', // Athletic activities
  ],
  // Computer Science & Technology
  'computer-science': [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop&auto=format', // Code on screen
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=400&fit=crop&auto=format', // Programming setup
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=400&fit=crop&auto=format', // Computer circuits
    'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=400&fit=crop&auto=format', // Technology concept
  ],
  // Business & Economics
  business: [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop&auto=format', // Business documents
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&auto=format', // Charts and graphs
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&auto=format', // Business meeting
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&auto=format', // Financial planning
  ]
};

// Generate random educational template image
const getEducationalImage = (subject: string, index: number = 0): string => {
  const images = educationalImageService[subject as keyof typeof educationalImageService] || educationalImageService.math;
  return images[index % images.length];
};

interface TemplatesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToBasket?: (item: BasketItem) => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

type TemplateCategory = 'all' | 'recent' | 'popular' | 'math' | 'science' | 'english' | 'history' | 'geography' | 'art' | 'music' | 'pe' | 'computer-science' | 'business';

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  isRecent?: boolean;
  isPopular?: boolean;
  subjects?: string[];
  attribution?: string;
  license?: string;
  source?: 'unsplash' | 'generated' | 'placeholder';
}

// Safe, properly licensed template images with attribution
const mockTemplates: Template[] = [
  // Educational Templates - Math
  { 
    id: '1', 
    title: 'Math Worksheet', 
    category: 'Education', 
    description: 'Interactive mathematical problem sets and exercises',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop&auto=format', 
    isPopular: true,
    subjects: ['math'],
    attribution: 'Photo by Antoine Dautry on Unsplash',
    license: 'Unsplash License'
  },
  { 
    id: '2', 
    title: 'Science Lab Report', 
    category: 'Education', 
    description: 'Structured template for documenting scientific experiments',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop&auto=format', 
    isRecent: true, 
    isPopular: true,
    subjects: ['science'],
    attribution: 'Photo by Hans Reniers on Unsplash',
    license: 'Unsplash License'
  },
  { 
    id: '3', 
    title: 'History Timeline', 
    category: 'Education', 
    description: 'Visual timeline template for historical events and periods',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop&auto=format', 
    isRecent: true,
    subjects: ['history'],
    attribution: 'Photo by Giammarco Boscaro on Unsplash',
    license: 'Unsplash License'
  },
  { 
    id: '4', 
    title: 'Logo Template', 
    category: 'Branding', 
    description: 'Modern logo design for brand identity',
    imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['art', 'business']
  },
  { 
    id: '5', 
    title: 'Presentation Slide', 
    category: 'Presentation', 
    description: 'Clean slide layout for business presentations',
    imageUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['business', 'english']
  },
  { 
    id: '6', 
    title: 'Website Banner', 
    category: 'Web', 
    description: 'Hero banner for website headers',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['computer-science', 'art']
  },
  { 
    id: '7', 
    title: 'Newsletter', 
    category: 'Email', 
    description: 'Email newsletter layout with content blocks',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['english', 'business']
  },
  { 
    id: '8', 
    title: 'Poster Design', 
    category: 'Print', 
    description: 'Large format poster for advertising',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-364adec68479?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['art']
  },
  { 
    id: '9', 
    title: 'Resume Template', 
    category: 'Document', 
    description: 'Professional CV layout with modern styling',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', 
    isRecent: true, 
    isPopular: true,
    subjects: ['english', 'business']
  },
  { 
    id: '10', 
    title: 'Social Story', 
    category: 'Social Media', 
    description: 'Instagram story template with graphics',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['art', 'english']
  },
  { 
    id: '11', 
    title: 'Event Invite', 
    category: 'Events', 
    description: 'Invitation card for special occasions',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['art', 'english']
  },
  { 
    id: '12', 
    title: 'Menu Design', 
    category: 'Restaurant', 
    description: 'Restaurant menu with food categories',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['art', 'business']
  },
  
  // Additional templates with school subjects
  { 
    id: '13', 
    title: 'Math Worksheet', 
    category: 'Education', 
    description: 'Mathematical problem sets and exercises',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['math']
  },
  { 
    id: '14', 
    title: 'Science Report', 
    category: 'Education', 
    description: 'Lab report template for experiments',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['science']
  },
  { 
    id: '15', 
    title: 'History Timeline', 
    category: 'Education', 
    description: 'Historical events visualization template',
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['history']
  },
  { 
    id: '16', 
    title: 'Geography Map', 
    category: 'Education', 
    description: 'World map with labels and information',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['geography']
  },
  { 
    id: '17', 
    title: 'Art Portfolio', 
    category: 'Creative', 
    description: 'Showcase artwork and creative projects',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['art']
  },
  { 
    id: '18', 
    title: 'Music Sheet', 
    category: 'Creative', 
    description: 'Musical composition and notation template',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['music']
  },
  { 
    id: '19', 
    title: 'Exercise Plan', 
    category: 'Health', 
    description: 'Physical fitness workout schedule',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['pe']
  },
  { 
    id: '20', 
    title: 'Code Documentation', 
    category: 'Technology', 
    description: 'Programming project documentation',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['computer-science']
  },
  { 
    id: '21', 
    title: 'English Essay', 
    category: 'Education', 
    description: 'Academic writing template with structure',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['english']
  },
  { 
    id: '22', 
    title: 'Chemistry Lab', 
    category: 'Science', 
    description: 'Chemical equation and lab procedures',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['science']
  },
  { 
    id: '23', 
    title: 'Business Plan', 
    category: 'Business', 
    description: 'Comprehensive business strategy template',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop', 
    isRecent: true,
    subjects: ['business']
  },
  { 
    id: '24', 
    title: 'Language Flashcards', 
    category: 'Education', 
    description: 'Vocabulary learning cards template',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=400&fit=crop', 
    isPopular: true,
    subjects: ['english']
  }
];

const subjectFilters = [
  { key: 'math', label: 'Math', icon: Calculator },
  { key: 'science', label: 'Science', icon: Beaker },
  { key: 'english', label: 'English', icon: BookOpen },
  { key: 'history', label: 'History', icon: Clock },
  { key: 'geography', label: 'Geography', icon: Globe },
  { key: 'art', label: 'Art', icon: Paintbrush },
  { key: 'music', label: 'Music', icon: Music },
  { key: 'pe', label: 'PE', icon: Dumbbell },
  { key: 'computer-science', label: 'Computer Science', icon: Code },
  { key: 'business', label: 'Business', icon: TrendingUp }
];

export function TemplatesDropdown({ isOpen, onClose, isMobile = false, screenSize = 'desktop' }: TemplatesDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCategoryChange = (category: TemplateCategory) => {
    if (category === activeCategory) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsTransitioning(false);
    }, 150);
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'recent') return matchesSearch && template.isRecent;
    if (activeCategory === 'popular') return matchesSearch && template.isPopular;
    if (subjectFilters.some(subject => subject.key === activeCategory)) {
      return matchesSearch && template.subjects?.includes(activeCategory);
    }
    return matchesSearch;
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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Layout className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Templates</h3>
                <p className="text-sm text-gray-500">Pre-made designs</p>
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
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Mobile Filter buttons - Scrollable */}
          <div className="border-b border-border bg-white">
            <div className="flex items-center gap-2 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <Button
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange('all')}
                className="h-10 whitespace-nowrap flex-shrink-0"
              >
                All Templates
              </Button>
              <Button
                variant={activeCategory === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange('recent')}
                className="h-10 whitespace-nowrap flex-shrink-0"
              >
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </Button>
              <Button
                variant={activeCategory === 'popular' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange('popular')}
                className="h-10 whitespace-nowrap flex-shrink-0"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Popular
              </Button>
              {subjectFilters.map((subject) => {
                const IconComponent = subject.icon;
                return (
                  <Button
                    key={subject.key}
                    variant={activeCategory === subject.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(subject.key as TemplateCategory)}
                    className="h-10 whitespace-nowrap flex-shrink-0"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {subject.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Mobile Templates Grid - Square cards */}
          <div className="flex-1 overflow-hidden p-4">
            <div className={`h-full transition-all duration-150 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden h-fit"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <ImageWithFallback
                        src={template.imageUrl}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900 truncate mb-1">{template.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">{template.description}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {template.isRecent && (
                          <div className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                            Recent
                          </div>
                        )}
                        {template.isPopular && (
                          <div className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs">
                            Popular
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-lg mb-2">No templates found</p>
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
                placeholder="Search templates..."
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

        {/* Filter buttons - Scrollable */}
        <div className="border-b border-border">
          <div className="flex items-center gap-2 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
              className="h-8 flex-shrink-0"
            >
              All Templates
            </Button>
            <Button
              variant={activeCategory === 'recent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('recent')}
              className="h-8 flex-shrink-0"
            >
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </Button>
            <Button
              variant={activeCategory === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('popular')}
              className="h-8 flex-shrink-0"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Popular
            </Button>
            {subjectFilters.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Button
                  key={subject.key}
                  variant={activeCategory === subject.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(subject.key as TemplateCategory)}
                  className="h-8 flex-shrink-0"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {subject.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Templates unified scroll - Two rows, square cards, twice as big */}
        <div className="flex-1 overflow-hidden p-4">
          <div className={`h-full transition-all duration-150 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="overflow-x-auto overflow-y-hidden h-full pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="grid grid-rows-2 grid-flow-col gap-4 h-full" style={{ width: 'max-content' }}>
                {filteredTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden w-56 h-full"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <ImageWithFallback
                        src={template.imageUrl}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-base text-gray-900 leading-tight mb-2 truncate">{template.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">{template.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {template.isRecent && (
                          <div className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded text-sm whitespace-nowrap">
                            Recent
                          </div>
                        )}
                        {template.isPopular && (
                          <div className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded text-sm whitespace-nowrap">
                            Popular
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg mb-2">No templates found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}