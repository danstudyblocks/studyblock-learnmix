import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Edit3,
  Share2,
  Layout,
  Shapes,
  Upload,
  Type,
  ChevronDown,
  ChevronUp,
  Square,
  Layers3,
  Sparkles,
  Printer,
  Download,
  Store,
  // ZoomIn,
  // ZoomOut,
  // Move,
  // MousePointer2,
  // Maximize2,
  // Undo2,
  // Redo2,
  Grid3x3,
} from "lucide-react"
import { TemplatesDropdown } from "./TemplatesDropdown"
import { ElementsDropdown } from "./ElementsDropdown"
import { BlocksDropdown } from "./BlocksDropdown"
import { UploadDropdown } from "./UploadDropdown"
import { TextFormattingToolbar } from "./TextFormattingToolbar"
import { ElementEditingToolbar } from "./ElementEditingToolbar"
import { CanvasDropdown } from "./CanvasDropdown"
import { LayersDropdown } from "./LayersDropdown"
import { AIToolsDropdown } from "./AIToolsDropdown"
import { PrintDropdown } from "./PrintDropdown"
import { DownloadDropdown } from "./DownloadDropdown"
import { MarketplaceDropdown } from "./MarketplaceDropdown"

interface BasketItem {
  id: string
  name: string
  price: number
  unit: string
  description: string
  quantity: number
}

interface SecondaryToolbarProps {
  onAddMenuToggle: (isOpen: boolean) => void
  onEditMenuToggle: (isOpen: boolean) => void
  onShareMenuToggle: (isOpen: boolean) => void
  onTemplatesToggle: (isOpen: boolean) => void
  onElementsToggle: (isOpen: boolean) => void
  onBlocksToggle: (isOpen: boolean) => void
  onUploadToggle: (isOpen: boolean) => void
  onTextFormattingToggle: (isOpen: boolean) => void
  onElementEditingToggle: (isOpen: boolean) => void
  onCanvasToggle: (isOpen: boolean) => void
  onLayersToggle: (isOpen: boolean) => void
  onAIToolsToggle: (isOpen: boolean) => void
  onPrintToggle: (isOpen: boolean) => void
  onDownloadToggle: (isOpen: boolean) => void
  onMarketplaceToggle: (isOpen: boolean) => void
  isTextFormattingOpen?: boolean
  isElementEditingOpen?: boolean
  isUploadOpen?: boolean
  isCanvasOpen?: boolean
  isLayersOpen?: boolean
  isAIToolsOpen?: boolean
  isPrintOpen?: boolean
  isDownloadOpen?: boolean
  isMarketplaceOpen?: boolean
  isBlocksOpen?: boolean
  selectedElementType?: "text" | "graphic" | null
  onAddText?: (textType: "heading" | "body") => void
  // Canvas toolbar props
  tool?: string
  setTool?: (tool: string) => void
  zoom?: number
  setZoom?: (zoom: number) => void
  fitToScreen?: boolean
  handleFitToScreen?: () => void
  canUndo?: boolean
  canRedo?: boolean
  handleUndo?: () => void
  handleRedo?: () => void
  // Basket props
  onAddToBasket?: (item: BasketItem) => void
  // Mobile props
  isMobile?: boolean
  isTablet?: boolean
  screenSize?: "mobile" | "tablet" | "desktop"
  isMobileMenuOpen?: boolean
  // Additional prop to help with text highlighting
  shouldHideTextFormatting?: boolean
  // Store prop for TextSection
  store?: any
}

export function Toolbar({
  onAddMenuToggle,
  onEditMenuToggle,
  onShareMenuToggle,
  onTemplatesToggle,
  onElementsToggle,
  onBlocksToggle,
  onUploadToggle,
  onTextFormattingToggle,
  onElementEditingToggle,
  onCanvasToggle,
  onLayersToggle,
  onAIToolsToggle,
  onPrintToggle,
  onDownloadToggle,
  onMarketplaceToggle,
  isTextFormattingOpen: externalTextFormattingOpen = false,
  isElementEditingOpen: externalElementEditingOpen = false,
  isUploadOpen: externalUploadOpen = false,
  isCanvasOpen: externalCanvasOpen = false,
  isLayersOpen: externalLayersOpen = false,
  isAIToolsOpen: externalAIToolsOpen = false,
  isPrintOpen: externalPrintOpen = false,
  isDownloadOpen: externalDownloadOpen = false,
  isMarketplaceOpen: externalMarketplaceOpen = false,
  isBlocksOpen: externalBlocksOpen = false,
  selectedElementType = null,
  onAddText = () => {},
  // Canvas toolbar props
  // tool = "select",
  // setTool = () => {},
  // zoom = 100,
  // setZoom = () => {},
  // fitToScreen = false,
  // handleFitToScreen = () => {},
  // canUndo = false,
  // canRedo = false,
  // handleUndo = () => {},
  // handleRedo = () => {},
  // Basket props
  onAddToBasket = () => {},
  // Mobile props
  isMobile = false,
  // isTablet = false,
  screenSize = "desktop",
  // isMobileMenuOpen = false,
  // Additional prop
  shouldHideTextFormatting = false,
  // Store prop
  store,
}: SecondaryToolbarProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [isElementsOpen, setIsElementsOpen] = useState(false)
  const [isBlocksOpen, setIsBlocksOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isTextFormattingOpen, setIsTextFormattingOpen] = useState(false)
  const [isElementEditingOpen, setIsElementEditingOpen] = useState(false)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [isLayersOpen, setIsLayersOpen] = useState(false)
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false)
  const [isPrintOpen, setIsPrintOpen] = useState(false)
  const [isDownloadOpen, setIsDownloadOpen] = useState(false)
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false)

  // Sync external states with local states
  useEffect(() => {
    setIsTextFormattingOpen(externalTextFormattingOpen)
  }, [externalTextFormattingOpen])

  useEffect(() => {
    setIsElementEditingOpen(externalElementEditingOpen)
  }, [externalElementEditingOpen])

  useEffect(() => {
    setIsUploadOpen(externalUploadOpen)
  }, [externalUploadOpen])

  useEffect(() => {
    setIsCanvasOpen(externalCanvasOpen)
  }, [externalCanvasOpen])

  useEffect(() => {
    setIsLayersOpen(externalLayersOpen)
  }, [externalLayersOpen])

  useEffect(() => {
    setIsAIToolsOpen(externalAIToolsOpen)
  }, [externalAIToolsOpen])

  useEffect(() => {
    setIsPrintOpen(externalPrintOpen)
  }, [externalPrintOpen])

  useEffect(() => {
    setIsDownloadOpen(externalDownloadOpen)
  }, [externalDownloadOpen])

  useEffect(() => {
    setIsMarketplaceOpen(externalMarketplaceOpen)
  }, [externalMarketplaceOpen])

  useEffect(() => {
    setIsBlocksOpen(externalBlocksOpen)
  }, [externalBlocksOpen])

  const closeSpecialMenus = () => {
    if (isTemplatesOpen) {
      setIsTemplatesOpen(false)
      onTemplatesToggle(false)
    }
    if (isElementsOpen) {
      setIsElementsOpen(false)
      onElementsToggle(false)
    }
    if (isBlocksOpen) {
      setIsBlocksOpen(false)
      onBlocksToggle(false)
    }
    if (isUploadOpen) {
      setIsUploadOpen(false)
      onUploadToggle(false)
    }
    if (isTextFormattingOpen) {
      setIsTextFormattingOpen(false)
      onTextFormattingToggle(false)
    }
    if (isElementEditingOpen) {
      setIsElementEditingOpen(false)
      onElementEditingToggle(false)
    }
    if (isCanvasOpen) {
      setIsCanvasOpen(false)
      onCanvasToggle(false)
    }
    if (isLayersOpen) {
      setIsLayersOpen(false)
      onLayersToggle(false)
    }
    if (isAIToolsOpen) {
      setIsAIToolsOpen(false)
      onAIToolsToggle(false)
    }
    if (isPrintOpen) {
      setIsPrintOpen(false)
      onPrintToggle(false)
    }
    if (isDownloadOpen) {
      setIsDownloadOpen(false)
      onDownloadToggle(false)
    }
    if (isMarketplaceOpen) {
      setIsMarketplaceOpen(false)
      onMarketplaceToggle(false)
    }
  }

  const closeOtherMainMenus = (keepOpen: "add" | "edit" | "share") => {
    if (keepOpen !== "add" && isAddMenuOpen) {
      setIsAddMenuOpen(false)
      onAddMenuToggle(false)
    }
    if (keepOpen !== "edit" && isEditMenuOpen) {
      setIsEditMenuOpen(false)
      onEditMenuToggle(false)
    }
    if (keepOpen !== "share" && isShareMenuOpen) {
      setIsShareMenuOpen(false)
      onShareMenuToggle(false)
    }
  }

  const closeAllMenus = () => {
    // Close all main menu dropdowns
    if (isAddMenuOpen) {
      setIsAddMenuOpen(false)
      onAddMenuToggle(false)
    }
    if (isEditMenuOpen) {
      setIsEditMenuOpen(false)
      onEditMenuToggle(false)
    }
    if (isShareMenuOpen) {
      setIsShareMenuOpen(false)
      onShareMenuToggle(false)
    }
    // Close all special menus
    closeSpecialMenus()
  }

  const toggleAddMenu = () => {
    const newState = !isAddMenuOpen

    // Close other main menus but keep Add menu logic intact
    closeOtherMainMenus("add")
    // Close all special menus
    closeSpecialMenus()

    // Then set the new state for this menu
    setIsAddMenuOpen(newState)
    onAddMenuToggle(newState)
  }

  const toggleEditMenu = () => {
    const newState = !isEditMenuOpen

    // Close other main menus but keep Edit menu logic intact
    closeOtherMainMenus("edit")
    // Close all special menus
    closeSpecialMenus()

    // Then set the new state for this menu
    setIsEditMenuOpen(newState)
    onEditMenuToggle(newState)
  }

  const toggleShareMenu = () => {
    const newState = !isShareMenuOpen

    // Close other main menus but keep Share menu logic intact
    closeOtherMainMenus("share")
    // Close all special menus
    closeSpecialMenus()

    // Then set the new state for this menu
    setIsShareMenuOpen(newState)
    onShareMenuToggle(newState)
  }

  // Helper function to close only special menus not in the current category
  const closeOtherSpecialMenus = (
    category: "add" | "edit" | "share",
    keepOpen?: string
  ) => {
    const addMenus = ["templates", "elements", "blocks", "upload", "text"]
    const editMenus = ["canvas", "layers", "ai"]
    const shareMenus = ["print", "download", "marketplace"]

    // Close all menus not in the current category
    if (category !== "add") {
      addMenus.forEach((menu) => {
        switch (menu) {
          case "templates":
            if (isTemplatesOpen) {
              setIsTemplatesOpen(false)
              onTemplatesToggle(false)
            }
            break
          case "elements":
            if (isElementsOpen) {
              setIsElementsOpen(false)
              onElementsToggle(false)
            }
            break
          case "blocks":
            if (isBlocksOpen) {
              setIsBlocksOpen(false)
              onBlocksToggle(false)
            }
            break
          case "upload":
            if (isUploadOpen) {
              setIsUploadOpen(false)
              onUploadToggle(false)
            }
            break
          case "text":
            if (isTextFormattingOpen) {
              setIsTextFormattingOpen(false)
              onTextFormattingToggle(false)
            }
            break
        }
      })
    }

    if (category !== "edit") {
      editMenus.forEach((menu) => {
        switch (menu) {
          case "canvas":
            if (isCanvasOpen) {
              setIsCanvasOpen(false)
              onCanvasToggle(false)
            }
            break
          case "layers":
            if (isLayersOpen) {
              setIsLayersOpen(false)
              onLayersToggle(false)
            }
            break
          case "ai":
            if (isAIToolsOpen) {
              setIsAIToolsOpen(false)
              onAIToolsToggle(false)
            }
            break
        }
      })
    }

    if (category !== "share") {
      shareMenus.forEach((menu) => {
        switch (menu) {
          case "print":
            if (isPrintOpen) {
              setIsPrintOpen(false)
              onPrintToggle(false)
            }
            break
          case "download":
            if (isDownloadOpen) {
              setIsDownloadOpen(false)
              onDownloadToggle(false)
            }
            break
          case "marketplace":
            if (isMarketplaceOpen) {
              setIsMarketplaceOpen(false)
              onMarketplaceToggle(false)
            }
            break
        }
      })
    }

    // Close other menus in the same category (except the one being opened)
    if (category === "add") {
      addMenus.forEach((menu) => {
        if (menu !== keepOpen) {
          switch (menu) {
            case "templates":
              if (isTemplatesOpen) {
                setIsTemplatesOpen(false)
                onTemplatesToggle(false)
              }
              break
            case "elements":
              if (isElementsOpen) {
                setIsElementsOpen(false)
                onElementsToggle(false)
              }
              break
            case "blocks":
              if (isBlocksOpen) {
                setIsBlocksOpen(false)
                onBlocksToggle(false)
              }
              break
            case "upload":
              if (isUploadOpen) {
                setIsUploadOpen(false)
                onUploadToggle(false)
              }
              break
            case "text":
              if (isTextFormattingOpen) {
                setIsTextFormattingOpen(false)
                onTextFormattingToggle(false)
              }
              break
          }
        }
      })
    }

    if (category === "edit") {
      editMenus.forEach((menu) => {
        if (menu !== keepOpen) {
          switch (menu) {
            case "canvas":
              if (isCanvasOpen) {
                setIsCanvasOpen(false)
                onCanvasToggle(false)
              }
              break
            case "layers":
              if (isLayersOpen) {
                setIsLayersOpen(false)
                onLayersToggle(false)
              }
              break
            case "ai":
              if (isAIToolsOpen) {
                setIsAIToolsOpen(false)
                onAIToolsToggle(false)
              }
              break
          }
        }
      })
    }

    if (category === "share") {
      shareMenus.forEach((menu) => {
        if (menu !== keepOpen) {
          switch (menu) {
            case "print":
              if (isPrintOpen) {
                setIsPrintOpen(false)
                onPrintToggle(false)
              }
              break
            case "download":
              if (isDownloadOpen) {
                setIsDownloadOpen(false)
                onDownloadToggle(false)
              }
              break
            case "marketplace":
              if (isMarketplaceOpen) {
                setIsMarketplaceOpen(false)
                onMarketplaceToggle(false)
              }
              break
          }
        }
      })
    }
  }

  const handlePrintClick = () => {
    const newState = !isPrintOpen
    // Close other menus but keep Share menu open and ensure it's open
    closeOtherSpecialMenus("share", "print")
    if (!isShareMenuOpen) {
      setIsShareMenuOpen(true)
      onShareMenuToggle(true)
    }
    setIsPrintOpen(newState)
    onPrintToggle(newState)
  }

  const handleTemplatesClick = () => {
    const newState = !isTemplatesOpen
    // Close other menus but keep Add menu open and ensure it's open
    closeOtherSpecialMenus("add", "templates")
    if (!isAddMenuOpen) {
      setIsAddMenuOpen(true)
      onAddMenuToggle(true)
    }
    setIsTemplatesOpen(newState)
    onTemplatesToggle(newState)
  }

  const handleElementsClick = () => {
    const newState = !isElementsOpen
    // Close other menus but keep Add menu open and ensure it's open
    closeOtherSpecialMenus("add", "elements")
    if (!isAddMenuOpen) {
      setIsAddMenuOpen(true)
      onAddMenuToggle(true)
    }
    setIsElementsOpen(newState)
    onElementsToggle(newState)
  }

  const handleBlocksClick = () => {
    const newState = !isBlocksOpen
    // Close other menus but keep Add menu open and ensure it's open
    closeOtherSpecialMenus("add", "blocks")
    if (!isAddMenuOpen) {
      setIsAddMenuOpen(true)
      onAddMenuToggle(true)
    }
    setIsBlocksOpen(newState)
    onBlocksToggle(newState)
  }

  const handleUploadClick = () => {
    const newState = !isUploadOpen
    // Close other menus but keep Add menu open and ensure it's open
    closeOtherSpecialMenus("add", "upload")
    if (!isAddMenuOpen) {
      setIsAddMenuOpen(true)
      onAddMenuToggle(true)
    }
    setIsUploadOpen(newState)
    onUploadToggle(newState)
  }

  const handleTextClick = () => {
    const newState = !isTextFormattingOpen
    // Close other menus but keep Add menu open and ensure it's open
    closeOtherSpecialMenus("add", "text")
    if (!isAddMenuOpen) {
      setIsAddMenuOpen(true)
      onAddMenuToggle(true)
    }
    setIsTextFormattingOpen(newState)
    onTextFormattingToggle(newState)
  }

  const handleCanvasClick = () => {
    const newState = !isCanvasOpen
    // Close other menus but keep Edit menu open and ensure it's open
    closeOtherSpecialMenus("edit", "canvas")
    if (!isEditMenuOpen) {
      setIsEditMenuOpen(true)
      onEditMenuToggle(true)
    }
    setIsCanvasOpen(newState)
    onCanvasToggle(newState)
  }

  const handleLayersClick = () => {
    const newState = !isLayersOpen
    // Close other menus but keep Edit menu open and ensure it's open
    closeOtherSpecialMenus("edit", "layers")
    if (!isEditMenuOpen) {
      setIsEditMenuOpen(true)
      onEditMenuToggle(true)
    }
    setIsLayersOpen(newState)
    onLayersToggle(newState)
  }

  const handleAIToolsClick = () => {
    const newState = !isAIToolsOpen
    // Close other menus but keep Edit menu open and ensure it's open
    closeOtherSpecialMenus("edit", "ai")
    if (!isEditMenuOpen) {
      setIsEditMenuOpen(true)
      onEditMenuToggle(true)
    }
    setIsAIToolsOpen(newState)
    onAIToolsToggle(newState)
  }

  const handleDownloadClick = () => {
    const newState = !isDownloadOpen
    // Close other menus but keep Share menu open and ensure it's open
    closeOtherSpecialMenus("share", "download")
    if (!isShareMenuOpen) {
      setIsShareMenuOpen(true)
      onShareMenuToggle(true)
    }
    setIsDownloadOpen(newState)
    onDownloadToggle(newState)
  }

  const handleMarketplaceClick = () => {
    const newState = !isMarketplaceOpen
    // Close other menus but keep Share menu open and ensure it's open
    closeOtherSpecialMenus("share", "marketplace")
    if (!isShareMenuOpen) {
      setIsShareMenuOpen(true)
      onShareMenuToggle(true)
    }
    setIsMarketplaceOpen(newState)
    onMarketplaceToggle(newState)
  }

  // Determine button highlighting - only highlight when menu is actually open and not hidden
  const isTextHighlighted = isTextFormattingOpen && !shouldHideTextFormatting
  const isElementsHighlighted = isElementsOpen

  // Consistent sizing across all screen sizes
  const buttonSize = "sm"
  const buttonHeight = "h-8"
  const buttonPadding = "px-4 py-2"
  const toolbarHeight = isMobile ? "h-16" : "h-14"
  const toolbarPadding = isMobile ? "px-4 py-4" : "px-6 py-6"
  const menuHeight = isMobile ? "h-auto min-h-32" : "h-24"

  // Check if any second-level menu is open
  const isSecondLevelMenuOpen =
    isTemplatesOpen ||
    isElementsOpen ||
    isBlocksOpen ||
    isUploadOpen ||
    isTextFormattingOpen ||
    isCanvasOpen ||
    isLayersOpen ||
    isAIToolsOpen ||
    isPrintOpen ||
    isDownloadOpen ||
    isMarketplaceOpen

  // On mobile, hide first-level navigation when second-level menu is open
  const showFirstLevelNav = !isMobile || !isSecondLevelMenuOpen

  // Determine if we need a bottom border on the main toolbar
  // const needsBottomBorder = isAddMenuOpen || isEditMenuOpen || isShareMenuOpen

  return (
    <div className="relative">
      {showFirstLevelNav && (
        <div
          className={`${toolbarHeight} bg-gray-50 border-b border-border flex items-center ${toolbarPadding} ${
            isMobile ? "flex-wrap" : ""
          }`}
        >
          {/* Main Action Buttons - Left aligned on mobile */}
          <div
            className={`flex items-center gap-2 sm:gap-3 ${
              isMobile ? "w-full justify-start mb-2" : ""
            }`}
          >
            <Button
              variant="default"
              size={buttonSize}
              onClick={toggleAddMenu}
              className={`rounded-full ${buttonPadding} ${buttonHeight} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 ${
                isAddMenuOpen ? "ring-2 ring-purple-300" : ""
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="text-sm">Add</span>
              {isAddMenuOpen ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>

            <Button
              variant="default"
              size={buttonSize}
              onClick={toggleEditMenu}
              className={`rounded-full ${buttonPadding} ${buttonHeight} bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 ${
                isEditMenuOpen ? "ring-2 ring-blue-300" : ""
              }`}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              <span className="text-sm">Edit</span>
              {isEditMenuOpen ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>

            <Button
              variant="default"
              size={buttonSize}
              onClick={toggleShareMenu}
              className={`rounded-full ${buttonPadding} ${buttonHeight} bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 ${
                isShareMenuOpen ? "ring-2 ring-emerald-300" : ""
              }`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              <span className="text-sm">Share</span>
              {isShareMenuOpen ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>

          {/* Canvas toolbar - Desktop on right, Mobile on separate row */}
          
        </div>
      )}

      {/* Add menu - Only show border when this is the last visible menu */}
      {isAddMenuOpen && (
        <div
          className={`bg-white ${
            !isEditMenuOpen && !isShareMenuOpen ? "border-b border-border" : ""
          } transition-all duration-300 ease-in-out overflow-hidden ${menuHeight} ${
            isMobile ? "relative z-50" : ""
          }`}
        >
          <div className={`${toolbarPadding} h-full flex items-center`}>
            <div
              className={`${
                isMobile
                  ? "flex flex-col gap-3 w-full"
                  : "flex items-center justify-start gap-4 w-full"
              }`}
            >
              {/* Text menu item - Now first */}
              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isTextHighlighted ? "bg-indigo-50 ring-2 ring-indigo-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleTextClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div
                    className={`font-medium text-gray-900 text-sm ${
                      isMobile ? "leading-tight" : ""
                    }`}
                  >
                    {isMobile ? (
                      <>
                        Text
                        <br />
                        <span className="text-xs text-gray-500 font-normal">
                          Headings &amp; body
                        </span>
                      </>
                    ) : (
                      "Text"
                    )}
                  </div>
                  {!isMobile && (
                    <div className="text-xs text-gray-500">
                      Headings &amp; body
                    </div>
                  )}
                </div>
              </div>

              {/* Elements - Second */}
              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isElementsHighlighted
                    ? "bg-green-50 ring-2 ring-green-200"
                    : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleElementsClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Shapes className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Elements
                  </div>
                  <div className="text-xs text-gray-500">
                    Shapes &amp; graphics
                  </div>
                </div>
              </div>

              {/* Blocks - Third */}
              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isBlocksOpen ? "bg-pink-50 ring-2 ring-pink-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleBlocksClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Grid3x3 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Blocks
                  </div>
                  <div className="text-xs text-gray-500">Layout components</div>
                </div>
              </div>

              {/* Upload - Fourth */}
              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isUploadOpen ? "bg-orange-50 ring-2 ring-orange-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleUploadClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Upload
                  </div>
                  <div className="text-xs text-gray-500">Your images</div>
                </div>
              </div>

              {/* Templates - Now last */}
              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isTemplatesOpen ? "bg-blue-50 ring-2 ring-blue-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleTemplatesClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Templates
                  </div>
                  <div className="text-xs text-gray-500">Pre-made designs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit menu - Only show border when this is the last visible menu */}
      {isEditMenuOpen && (
        <div
          className={`bg-white ${
            !isShareMenuOpen ? "border-b border-border" : ""
          } transition-all duration-300 ease-in-out overflow-hidden ${menuHeight} ${
            isMobile ? "relative z-50" : ""
          }`}
        >
          <div className={`${toolbarPadding} h-full flex items-center`}>
            <div
              className={`${
                isMobile
                  ? "flex flex-col gap-3 w-full"
                  : "flex items-center justify-start gap-4 w-full"
              }`}
            >
              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isCanvasOpen ? "bg-slate-50 ring-2 ring-slate-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleCanvasClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Square className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Canvas
                  </div>
                  <div className="text-xs text-gray-500">
                    Resize &amp; settings
                  </div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isLayersOpen ? "bg-violet-50 ring-2 ring-violet-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleLayersClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Layers3 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Layers
                  </div>
                  <div className="text-xs text-gray-500">Manage elements</div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isAIToolsOpen ? "bg-amber-50 ring-2 ring-amber-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleAIToolsClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    AI Tools
                  </div>
                  <div className="text-xs text-gray-500">Smart assistance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share menu - Only show border when this is the last visible menu */}
      {isShareMenuOpen && (
        <div className="bg-white border-b border-border transition-all duration-300 ease-in-out overflow-hidden h-24">
          <div className={`${toolbarPadding} h-full flex items-center`}>
            <div
              className={`${
                isMobile
                  ? "flex flex-col gap-3 w-full"
                  : "flex items-center justify-start gap-4 w-full"
              }`}
            >
              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isPrintOpen ? "bg-red-50 ring-2 ring-red-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handlePrintClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Print</div>
                  <div className="text-xs text-gray-500">Print design</div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isDownloadOpen ? "bg-cyan-50 ring-2 ring-cyan-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleDownloadClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Download
                  </div>
                  <div className="text-xs text-gray-500">Export files</div>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105 group ${
                  isMarketplaceOpen ? "bg-purple-50 ring-2 ring-purple-200" : ""
                } ${isMobile ? "w-full min-h-16" : "flex-shrink-0"}`}
                onClick={handleMarketplaceClick}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center transition-shadow">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    Marketplace
                  </div>
                  <div className="text-xs text-gray-500">Sell designs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Second-level menus */}
      {isTemplatesOpen && (
        <TemplatesDropdown
          isOpen={isTemplatesOpen}
          onClose={() => handleTemplatesClick()}
          onAddToBasket={onAddToBasket}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isElementsOpen && (
        <ElementsDropdown
          isOpen={isElementsOpen}
          onClose={() => handleElementsClick()}
          onAddToBasket={onAddToBasket}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isBlocksOpen && (
        <BlocksDropdown
          isOpen={isBlocksOpen}
          onClose={() => handleBlocksClick()}
          onAddToBasket={onAddToBasket}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isUploadOpen && (
        <UploadDropdown
          isOpen={isUploadOpen}
          onClose={() => handleUploadClick()}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {/* Text formatting toolbar - only show when not hidden */}
      {isTextFormattingOpen && !shouldHideTextFormatting && (
        <TextFormattingToolbar
          isOpen={isTextFormattingOpen}
          onClose={() => onTextFormattingToggle(false)}
          onAddText={onAddText}
          isMobile={isMobile}
          screenSize={screenSize}
          store={store}
        />
      )}

      {isElementEditingOpen && (
        <ElementEditingToolbar
          isOpen={isElementEditingOpen}
          onClose={() => onElementEditingToggle(false)}
          selectedElementType={selectedElementType}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isCanvasOpen && (
        <CanvasDropdown
          isOpen={isCanvasOpen}
          onClose={() => handleCanvasClick()}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isLayersOpen && (
        <LayersDropdown
          isOpen={isLayersOpen}
          onClose={() => handleLayersClick()}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isAIToolsOpen && (
        <AIToolsDropdown
          isOpen={isAIToolsOpen}
          onClose={() => handleAIToolsClick()}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isPrintOpen && (
        <PrintDropdown
          isOpen={isPrintOpen}
          onClose={() => handlePrintClick()}
          onAddToBasket={onAddToBasket}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isDownloadOpen && (
        <DownloadDropdown
          isOpen={isDownloadOpen}
          onClose={() => handleDownloadClick()}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}

      {isMarketplaceOpen && (
        <MarketplaceDropdown
          isOpen={isMarketplaceOpen}
          onClose={() => handleMarketplaceClick()}
          isMobile={isMobile}
          screenSize={screenSize}
        />
      )}
    </div>
  )
}
