import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  X,
  Layout,
  Upload,
  FileText,
  Presentation,
  Image,
  FileImage,
  Smartphone,
  Monitor,
  CreditCard,
  Square,
  MapPin,
  Calendar,
  BookOpen,
} from "lucide-react"

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [dragOver, setDragOver] = useState(false)

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    // Handle file upload logic here
  }

  const templateOptions = [
    {
      id: 1,
      title: "Educational Poster",
      category: "Education",
      thumbnail:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop&crop=center",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      title: "Presentation Slide",
      category: "Business",
      thumbnail:
        "https://images.unsplash.com/photo-1553484771-371a605b060b?w=300&h=200&fit=crop&crop=center",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      id: 3,
      title: "Infographic",
      category: "Marketing",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center",
      gradient: "from-green-400 to-green-600",
    },
    {
      id: 4,
      title: "Social Media Post",
      category: "Social",
      thumbnail:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop&crop=center",
      gradient: "from-pink-400 to-pink-600",
    },
    {
      id: 5,
      title: "Course Certificate",
      category: "Education",
      thumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center",
      gradient: "from-amber-400 to-amber-600",
    },
    {
      id: 6,
      title: "Learning Timeline",
      category: "Education",
      thumbnail:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop&crop=center",
      gradient: "from-indigo-400 to-indigo-600",
    },
    {
      id: 7,
      title: "Student Report",
      category: "Academic",
      thumbnail:
        "https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=300&h=200&fit=crop&crop=center",
      gradient: "from-red-400 to-red-600",
    },
    {
      id: 8,
      title: "Science Diagram",
      category: "Science",
      thumbnail:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=200&fit=crop&crop=center",
      gradient: "from-teal-400 to-teal-600",
    },
    {
      id: 9,
      title: "Math Worksheet",
      category: "Mathematics",
      thumbnail:
        "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&h=200&fit=crop&crop=center",
      gradient: "from-orange-400 to-orange-600",
    },
    {
      id: 10,
      title: "Reading Guide",
      category: "Literature",
      thumbnail:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop&crop=center",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      id: 11,
      title: "Study Schedule",
      category: "Planning",
      thumbnail:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center",
      gradient: "from-violet-400 to-violet-600",
    },
    {
      id: 12,
      title: "Language Flashcard",
      category: "Languages",
      thumbnail:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop&crop=center",
      gradient: "from-rose-400 to-rose-600",
    },
    {
      id: 13,
      title: "Quiz Template",
      category: "Assessment",
      thumbnail:
        "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&h=200&fit=crop&crop=center",
      gradient: "from-lime-400 to-lime-600",
    },
    {
      id: 14,
      title: "Mind Map",
      category: "Brainstorming",
      thumbnail:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop&crop=center",
      gradient: "from-sky-400 to-sky-600",
    },
    {
      id: 15,
      title: "Class Newsletter",
      category: "Communication",
      thumbnail:
        "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=300&h=200&fit=crop&crop=center",
      gradient: "from-fuchsia-400 to-fuchsia-600",
    },
  ]

  const canvasSizes = [
    {
      name: "A4",
      size: "210 × 297 mm",
      description: "Perfect for documents",
      icon: FileText,
      gradient: "from-slate-400 to-slate-600",
    },
    {
      name: "A3",
      size: "297 × 420 mm",
      description: "Large format posters",
      icon: FileImage,
      gradient: "from-gray-400 to-gray-600",
    },
    {
      name: "A2",
      size: "420 × 594 mm",
      description: "Extra large posters",
      icon: FileImage,
      gradient: "from-zinc-400 to-zinc-600",
    },
    {
      name: "PowerPoint",
      size: "1920 × 1080 px",
      description: "Presentation slides",
      icon: Presentation,
      gradient: "from-orange-400 to-orange-600",
    },
    {
      name: "Social Media",
      size: "1080 × 1080 px",
      description: "Instagram posts",
      icon: Image,
      gradient: "from-indigo-400 to-indigo-600",
    },
    {
      name: "Story",
      size: "1080 × 1920 px",
      description: "Instagram/Facebook stories",
      icon: Smartphone,
      gradient: "from-pink-400 to-pink-600",
    },
    {
      name: "Desktop Wallpaper",
      size: "1920 × 1080 px",
      description: "Computer backgrounds",
      icon: Monitor,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      name: "Business Card",
      size: "85 × 55 mm",
      description: "Standard business cards",
      icon: CreditCard,
      gradient: "from-green-400 to-green-600",
    },
    {
      name: "Postcard",
      size: "148 × 105 mm",
      description: "Greeting cards",
      icon: MapPin,
      gradient: "from-purple-400 to-purple-600",
    },
    {
      name: "Sticker",
      size: "100 × 100 mm",
      description: "Custom stickers",
      icon: Square,
      gradient: "from-yellow-400 to-yellow-600",
    },
    {
      name: "Calendar",
      size: "210 × 297 mm",
      description: "Monthly calendars",
      icon: Calendar,
      gradient: "from-red-400 to-red-600",
    },
    {
      name: "Booklet",
      size: "148 × 210 mm",
      description: "Small booklets",
      icon: BookOpen,
      gradient: "from-teal-400 to-teal-600",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to learnmix</h1>
            <p className="text-xl text-white/90">
              Create amazing educational content in minutes
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] no-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Column - New Design and Upload */}
            <div className="lg:col-span-1 space-y-8">
              {/* New Design Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      New Design
                    </h2>
                    <p className="text-gray-600">
                      Start fresh with a custom canvas
                    </p>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-3 pr-2 no-scrollbar">
                  {canvasSizes.map((canvas) => {
                    const IconComponent = canvas.icon
                    return (
                      <div
                        key={canvas.name}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
                        onClick={() => {
                          onClose()
                        }}
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${canvas.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">
                            {canvas.name}
                          </h3>
                          <p className="text-sm text-gray-500">{canvas.size}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {canvas.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Upload Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Upload File
                    </h2>
                    <p className="text-gray-600">
                      Open existing learnmix files
                    </p>
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed ${
                    dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
                  } rounded-xl p-8 text-center transition-all hover:border-gray-400`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className={`w-16 h-16 ${
                        dragOver ? "bg-blue-100" : "bg-gray-100"
                      } rounded-full flex items-center justify-center transition-colors`}
                    >
                      <Upload
                        className={`w-8 h-8 ${
                          dragOver ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">
                        {dragOver
                          ? "Drop your file here"
                          : "Drag & drop your learnmix file"}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports .lmx, .json files
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = ".lmx,.json"
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files
                            if (files) {
                              onClose()
                            }
                          }
                          input.click()
                        }}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Templates */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Start with a Template
                  </h2>
                  <p className="text-gray-600">
                    Choose from our collection of educational templates
                  </p>
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {templateOptions.map((template) => (
                    <div
                      key={template.id}
                      className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                      onClick={() => {
                        onClose()
                      }}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {template.title}
                          </h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0 ml-2">
                            {template.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
