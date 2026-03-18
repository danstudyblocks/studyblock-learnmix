import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, Grid3x3, Layout, Heading, Sidebar, Square, AlignLeft, AlignCenter, Columns, Rows, Image, Type, Box } from "lucide-react";

interface BlocksDropdownProps {
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

export function BlocksDropdown({ isOpen, onClose, isMobile = false, screenSize = 'desktop' }: BlocksDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Mathematics");


  if (!isOpen) return null;

  const blockCategories = [
    {
      name: "Mathematics",
      icon: Square,
      color: "bg-blue-500",
      blocks: [
        { name: "Number Line", description: "Interactive number sequence" },
        { name: "Fraction Circles", description: "Visual fraction representation" },
        { name: "Graph Paper", description: "Coordinate grid layout" },
        { name: "Equation Block", description: "Mathematical formula display" },
        { name: "Word Problem", description: "Structured problem layout" },
        { name: "Calculator Display", description: "Digital calculation interface" },
        { name: "Geometric Shapes", description: "Shape identification grid" },
        { name: "Data Table", description: "Organized numerical data" },
      ]
    },
    {
      name: "Science",
      icon: Layout,
      color: "bg-green-500",
      blocks: [
        { name: "Experiment Steps", description: "Sequential procedure layout" },
        { name: "Hypothesis Block", description: "Scientific prediction format" },
        { name: "Observation Chart", description: "Data collection table" },
        { name: "Diagram Labeling", description: "Scientific illustration" },
        { name: "Lab Report", description: "Structured report template" },
        { name: "Elements Chart", description: "Periodic table section" },
        { name: "Food Chain", description: "Ecosystem relationship diagram" },
        { name: "Weather Data", description: "Climate information display" },
      ]
    },
    {
      name: "English",
      icon: Type,
      color: "bg-purple-500",
      blocks: [
        { name: "Story Map", description: "Narrative structure organizer" },
        { name: "Character Profile", description: "Character analysis template" },
        { name: "Vocabulary Cards", description: "Word definition layout" },
        { name: "Essay Outline", description: "Writing structure guide" },
        { name: "Poetry Format", description: "Verse and stanza layout" },
        { name: "Reading Comprehension", description: "Question and answer format" },
        { name: "Grammar Practice", description: "Language exercise template" },
        { name: "Book Review", description: "Literature analysis format" },
      ]
    },
    {
      name: "History",
      icon: Heading,
      color: "bg-orange-500",
      blocks: [
        { name: "Timeline", description: "Chronological event sequence" },
        { name: "Historical Figure", description: "Biography template" },
        { name: "Map Activity", description: "Geographic historical context" },
        { name: "Primary Source", description: "Document analysis format" },
        { name: "Cause & Effect", description: "Historical relationship chart" },
        { name: "Civilization Chart", description: "Cultural comparison table" },
        { name: "War Timeline", description: "Conflict chronology" },
        { name: "Government Structure", description: "Political system diagram" },
      ]
    },
    {
      name: "Geography",
      icon: Image,
      color: "bg-red-500",
      blocks: [
        { name: "World Map", description: "Global geography layout" },
        { name: "Country Profile", description: "Nation information template" },
        { name: "Climate Zones", description: "Weather pattern display" },
        { name: "Landform Guide", description: "Geographic feature catalog" },
        { name: "Population Chart", description: "Demographic data display" },
        { name: "Resource Map", description: "Natural resource distribution" },
        { name: "City Planning", description: "Urban development layout" },
        { name: "Travel Guide", description: "Destination information format" },
      ]
    },
    {
      name: "Art",
      icon: AlignCenter,
      color: "bg-pink-500",
      blocks: [
        { name: "Color Wheel", description: "Color theory demonstration" },
        { name: "Art Gallery", description: "Artwork showcase layout" },
        { name: "Drawing Tutorial", description: "Step-by-step art guide" },
        { name: "Artist Biography", description: "Creator profile template" },
        { name: "Art Critique", description: "Analysis and review format" },
        { name: "Technique Guide", description: "Art method instruction" },
        { name: "Portfolio Layout", description: "Artwork collection display" },
        { name: "Art History", description: "Movement timeline template" },
      ]
    },
    {
      name: "Music",
      icon: Rows,
      color: "bg-cyan-500",
      blocks: [
        { name: "Music Staff", description: "Musical notation layout" },
        { name: "Instrument Guide", description: "Musical instrument catalog" },
        { name: "Composer Profile", description: "Musician biography template" },
        { name: "Song Analysis", description: "Musical structure breakdown" },
        { name: "Practice Schedule", description: "Music lesson planner" },
        { name: "Concert Program", description: "Performance information layout" },
        { name: "Music Theory", description: "Educational concept display" },
        { name: "Rhythm Patterns", description: "Beat and tempo guide" },
      ]
    },
    {
      name: "PE & Health",
      icon: Sidebar,
      color: "bg-yellow-500",
      blocks: [
        { name: "Exercise Routine", description: "Workout instruction layout" },
        { name: "Nutrition Guide", description: "Healthy eating information" },
        { name: "Sports Rules", description: "Game regulation display" },
        { name: "Body Systems", description: "Human anatomy diagram" },
        { name: "Safety Tips", description: "Health precaution guide" },
        { name: "Fitness Tracker", description: "Physical activity monitor" },
        { name: "Team Roster", description: "Player information layout" },
        { name: "Health Quiz", description: "Wellness knowledge test" },
      ]
    }
  ];

  const filteredCategories = blockCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.blocks.some(block => 
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentCategory = blockCategories.find(cat => cat.name === selectedCategory);

  // Mobile full-screen positioning
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-dropdown overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Grid3x3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Educational Blocks</h3>
                <p className="text-sm text-gray-500">Subject-specific components</p>
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
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              {/* Categories */}
              <div className="p-4 border-b border-border">
                <h4 className="font-medium text-gray-900 mb-3">School Subjects</h4>
                <div className="grid grid-cols-2 gap-3">
                  {filteredCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                          selectedCategory === category.name 
                            ? 'bg-gray-100 ring-2 ring-gray-200' 
                            : ''
                        }`}
                      >
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500">{category.blocks.length} blocks</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blocks */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    {currentCategory?.name} Blocks
                  </h4>
                  <span className="text-sm text-gray-500">
                    {currentCategory?.blocks.length} items
                  </span>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: 'thin' }}>
                  {currentCategory?.blocks.map((block, index) => (
                    <div
                      key={`${block.name}-${index}`}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition-all duration-200 border border-gray-200 group flex-shrink-0 w-44"
                    >
                      {/* Mobile Block Preview */}
                      <div className="w-full h-20 bg-white rounded-lg mb-3 border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                        <div className="flex flex-col items-center gap-1">
                          {/* Simplified mobile previews */}
                          {(block.name.includes('Timeline') || block.name.includes('Line')) && (
                            <div className="space-y-1">
                              <div className="w-12 h-1 bg-gray-300 rounded"></div>
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                              </div>
                            </div>
                          )}
                          {(block.name.includes('Chart') || block.name.includes('Table') || block.name.includes('Data')) && (
                            <div className="grid grid-cols-3 gap-0.5">
                              <div className="w-2 h-1.5 bg-gray-300 rounded"></div>
                              <div className="w-2 h-2 bg-blue-300 rounded"></div>
                              <div className="w-2 h-3 bg-green-300 rounded"></div>
                            </div>
                          )}
                          {/* Default for all other blocks */}
                          {!block.name.includes('Timeline') && !block.name.includes('Line') && !block.name.includes('Chart') && !block.name.includes('Table') && !block.name.includes('Data') && (
                            <div className="w-8 h-6 bg-gray-300 rounded flex items-center justify-center">
                              <div className="w-4 h-3 bg-white rounded opacity-70"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <h5 className="font-medium text-gray-900 text-sm mb-1">{block.name}</h5>
                      <p className="text-xs text-gray-500">{block.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop positioning
  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-dropdown" style={{ height: '33vh' }}>
      <div className="h-full overflow-hidden">
        <div className="px-6 py-4 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Grid3x3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Educational Blocks</h3>
                <p className="text-sm text-gray-500">Subject-specific components</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories and Content */}
          <div className="flex gap-6 h-[calc(100%-140px)]">
            {/* Categories List - Thinner column */}
            <div className="w-48 flex-shrink-0 space-y-2 overflow-y-auto">
              <h4 className="font-medium text-gray-900 mb-3">Subjects</h4>
              {filteredCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                      selectedCategory === category.name 
                        ? 'bg-gray-100 ring-2 ring-gray-200' 
                        : ''
                    }`}
                  >
                    <div className={`w-6 h-6 ${category.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-3 h-3 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 text-xs truncate">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.blocks.length} blocks</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Blocks Grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h4 className="font-medium text-gray-900">
                  {currentCategory?.name} Blocks
                </h4>
                <span className="text-sm text-gray-500">
                  {currentCategory?.blocks.length} items
                </span>
              </div>
              
              <div className="flex gap-4 overflow-x-auto overflow-y-hidden pt-2 pb-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ scrollbarWidth: 'thin' }}>
                {currentCategory?.blocks.map((block, index) => (
                  <div
                    key={`${block.name}-${index}`}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md border border-gray-200 group flex-shrink-0 w-48"
                  >
                    {/* Block Preview */}
                    <div className="w-full h-24 bg-white rounded-lg mb-3 border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                      <div className="flex flex-col items-center gap-1">
                        {/* Educational block visual representations */}
                        {(block.name.includes('Timeline') || block.name.includes('Line')) && (
                          <div className="space-y-1">
                            <div className="w-16 h-1 bg-gray-300 rounded"></div>
                            <div className="flex gap-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            </div>
                          </div>
                        )}
                        {(block.name.includes('Chart') || block.name.includes('Table') || block.name.includes('Data')) && (
                          <div className="grid grid-cols-3 gap-1">
                            <div className="w-3 h-2 bg-gray-300 rounded"></div>
                            <div className="w-3 h-3 bg-blue-300 rounded"></div>
                            <div className="w-3 h-4 bg-green-300 rounded"></div>
                            <div className="w-3 h-1 bg-gray-200 rounded"></div>
                            <div className="w-3 h-2 bg-blue-200 rounded"></div>
                            <div className="w-3 h-3 bg-green-200 rounded"></div>
                          </div>
                        )}
                        {(block.name.includes('Map') || block.name.includes('Geography')) && (
                          <div className="relative w-12 h-8 bg-blue-100 rounded border">
                            <div className="absolute top-1 left-1 w-3 h-2 bg-green-400 rounded"></div>
                            <div className="absolute bottom-1 right-1 w-2 h-3 bg-brown-400 rounded"></div>
                          </div>
                        )}
                        {(block.name.includes('Equation') || block.name.includes('Formula')) && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-4 bg-gray-300 rounded"></div>
                            <div className="text-xs text-gray-600">+</div>
                            <div className="w-2 h-4 bg-gray-300 rounded"></div>
                            <div className="text-xs text-gray-600">=</div>
                            <div className="w-3 h-4 bg-blue-300 rounded"></div>
                          </div>
                        )}
                        {(block.name.includes('Circle') || block.name.includes('Shape')) && (
                          <div className="flex gap-1">
                            <div className="w-4 h-4 bg-red-300 rounded-full"></div>
                            <div className="w-4 h-4 bg-blue-300 rounded"></div>
                            <div className="w-4 h-4 bg-green-300" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                          </div>
                        )}
                        {(block.name.includes('Staff') || block.name.includes('Music')) && (
                          <div className="space-y-1">
                            <div className="w-16 h-0.5 bg-gray-300"></div>
                            <div className="w-16 h-0.5 bg-gray-300"></div>
                            <div className="w-16 h-0.5 bg-gray-300"></div>
                            <div className="w-16 h-0.5 bg-gray-300"></div>
                            <div className="w-16 h-0.5 bg-gray-300"></div>
                          </div>
                        )}
                        {block.name.includes('Experiment') && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-6 bg-gray-400 rounded-t-full"></div>
                            <div className="w-3 h-4 bg-blue-200 rounded-b-lg"></div>
                            <div className="w-1 h-8 bg-gray-300"></div>
                          </div>
                        )}
                        {(block.name.includes('Story') || block.name.includes('Text') || block.name.includes('Essay')) && (
                          <div className="space-y-1">
                            <div className="w-14 h-1 bg-gray-300 rounded"></div>
                            <div className="w-16 h-1 bg-gray-200 rounded"></div>
                            <div className="w-12 h-1 bg-gray-200 rounded"></div>
                            <div className="w-10 h-1 bg-gray-200 rounded"></div>
                          </div>
                        )}
                        {block.name.includes('Color') && (
                          <div className="w-8 h-8 rounded-full" style={{ background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' }}></div>
                        )}
                        {/* Default fallback */}
                        {!block.name.includes('Timeline') && !block.name.includes('Line') && !block.name.includes('Chart') && !block.name.includes('Table') && !block.name.includes('Data') && !block.name.includes('Map') && !block.name.includes('Geography') && !block.name.includes('Equation') && !block.name.includes('Formula') && !block.name.includes('Circle') && !block.name.includes('Shape') && !block.name.includes('Staff') && !block.name.includes('Music') && !block.name.includes('Experiment') && !block.name.includes('Story') && !block.name.includes('Text') && !block.name.includes('Essay') && !block.name.includes('Color') && (
                          <div className="w-12 h-8 bg-gray-300 rounded flex items-center justify-center">
                            <div className="w-6 h-4 bg-white rounded opacity-70"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Block Info */}
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm mb-1">{block.name}</h5>
                      <p className="text-xs text-gray-500">{block.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}