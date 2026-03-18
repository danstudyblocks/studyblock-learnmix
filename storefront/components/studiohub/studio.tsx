"use client"
import { WelcomeModal } from "../studio/WelcomSection"
import { useState, useEffect } from "react"
import { BasketModal, BasketItem } from "../studio/BasketModal"
import { SearchModal } from "../studio/SearchModal"
import { UpgradeModal } from "../studio/UpgradeModal"
import { UserLibraryModal } from "../studio/UserLibraryModal"
import { Header } from "../studio/Header"
import { Toolbar } from "../studio/Toolbar"
import { useMobile } from "@/components/studio/use-mobile"
import { Canvas } from "@/components/studio/Canvas"

import { PolotnoContainer } from "polotno"
import { createStore } from "polotno/model/store"

export default function DesignStudio({ customer }: any) {
  // Remove the old welcome modal state since we need to add more state
  // const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true)

  // Add the useMobile hook - you'll need to create this or import it
  const { isMobile, isTablet, screenSize } = useMobile()

  // For now, I'll add a simple mobile detection
  //   const [isMobile, setIsMobile] = useState(false)

  //   useEffect(() => {
  //     const checkMobile = () => {
  //       setIsMobile(window.innerWidth < 768)
  //     }
  //     checkMobile()
  //     window.addEventListener("resize", checkMobile)
  //     return () => window.removeEventListener("resize", checkMobile)
  //   }, [])

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

  // Element selection state
  const [selectedElementType, setSelectedElementType] = useState<
    "text" | "graphic" | null
  >(null)

  // Add text trigger state
  const [addTextTrigger, setAddTextTrigger] = useState<{
    type: "heading" | "body"
    timestamp: number
  } | null>(null)

  // Welcome modal state - Always start with true to show on every page load
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true)

  // Basket state
  const [basketItems, setBasketItems] = useState<BasketItem[]>([])
  const [isBasketModalOpen, setIsBasketModalOpen] = useState(false)

  // Search modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Upgrade modal state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  // User library modal state
  const [isUserLibraryModalOpen, setIsUserLibraryModalOpen] = useState(false)

  // Canvas toolbar state - Start with fit to screen enabled for auto-fit
  const [tool, setTool] = useState("select")
  const [zoom, setZoom] = useState(100) // Default zoom for manual control
  const [fitToScreen, setFitToScreen] = useState(true) // Start with auto-fit enabled
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  // Mobile-specific state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [store] = useState(() => {
    // Initialize with a default page
    const store = createStore({
      key: process.env.NEXT_PUBLIC_POLOTNO_API_KEY || "",
      showCredit: false,
    })
    const page = store.addPage()
    return store
  })

  // Remove the entire useEffect that checks localStorage - we don't need it anymore
  // Delete this entire block:
  // useEffect(() => {
  //   const checkWelcomeModal = () => {
  //     try {
  //       const hasVisited = localStorage.getItem("learnmix-visited");
  //       console.log("localStorage check - hasVisited:", hasVisited);
  //
  //       if (!hasVisited || hasVisited !== "true") {
  //         setIsWelcomeModalOpen(true);
  //       } else {
  //         setIsWelcomeModalOpen(false);
  //       }
  //     } catch (error) {
  //       console.error("localStorage error:", error);
  //       setIsWelcomeModalOpen(true);
  //     }
  //   };
  //
  //   checkWelcomeModal();
  //   const timeoutId = setTimeout(checkWelcomeModal, 100);
  //
  //   return () => clearTimeout(timeoutId);
  // }, []);

  // Load basket from localStorage on mount
  useEffect(() => {
    const savedBasket = localStorage.getItem("learnmix-basket")
    if (savedBasket) {
      try {
        const parsedBasket = JSON.parse(savedBasket)
        setBasketItems(parsedBasket)
      } catch (error) {
        console.error("Error loading basket from localStorage:", error)
      }
    }
  }, [])

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("learnmix-basket", JSON.stringify(basketItems))
  }, [basketItems])

  // Close all menus when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setIsAddMenuOpen(false)
      setIsEditMenuOpen(false)
      setIsShareMenuOpen(false)
      setIsTemplatesOpen(false)
      setIsElementsOpen(false)
      setIsBlocksOpen(false)
      setIsUploadOpen(false)
      setIsTextFormattingOpen(false)
      setIsElementEditingOpen(false)
      setIsCanvasOpen(false)
      setIsLayersOpen(false)
      setIsAIToolsOpen(false)
      setIsPrintOpen(false)
      setIsDownloadOpen(false)
      setIsMarketplaceOpen(false)
    }
  }, [isMobile])

  // Handle search modal opening when user types
  useEffect(() => {
    if (searchTerm.trim() && !isSearchModalOpen) {
      setIsSearchModalOpen(true)
    }
  }, [searchTerm, isSearchModalOpen])

  // Handle escape key to close modals
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isUpgradeModalOpen) {
          handleUpgradeModalClose()
        } else if (isSearchModalOpen) {
          handleSearchModalClose()
        } else if (isUserLibraryModalOpen) {
          handleUserLibraryModalClose()
        }
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isSearchModalOpen, isUpgradeModalOpen, isUserLibraryModalOpen])

  const handleWelcomeModalClose = () => {
    setIsWelcomeModalOpen(false)
    // Remove localStorage logic since we want it to show on every refresh
    // localStorage.setItem("learnmix-visited", "true");
  }

  const handleBasketClick = () => {
    setIsBasketModalOpen(true)
  }

  const handleBasketModalClose = () => {
    setIsBasketModalOpen(false)
  }

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false)
    setSearchTerm("")
  }

  const handleUpgradeClick = () => {
    setIsUpgradeModalOpen(true)
  }

  const handleUpgradeModalClose = () => {
    setIsUpgradeModalOpen(false)
  }

  const handleUserLibraryClick = () => {
    setIsUserLibraryModalOpen(true)
  }

  const handleUserLibraryModalClose = () => {
    setIsUserLibraryModalOpen(false)
  }

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term)
    if (term.trim() && !isSearchModalOpen) {
      setIsSearchModalOpen(true)
    }
  }

  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      setIsSearchModalOpen(true)
    }
  }

  const handleAddToBasket = (newItem: BasketItem) => {
    setBasketItems((prevItems) => {
      // Check if item already exists in basket
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id
      )

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, newItem]
      }
    })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setBasketItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setBasketItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    )
  }

  const handleClearBasket = () => {
    setBasketItems([])
  }

  const basketItemCount = basketItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const handleAddMenuToggle = (isOpen: boolean) => {
    setIsAddMenuOpen(isOpen)
    if (isMobile && isOpen) {
      // Close other menus on mobile
      setIsEditMenuOpen(false)
      setIsShareMenuOpen(false)
    }
  }

  const handleEditMenuToggle = (isOpen: boolean) => {
    setIsEditMenuOpen(isOpen)
    if (isMobile && isOpen) {
      setIsAddMenuOpen(false)
      setIsShareMenuOpen(false)
    }
  }

  const handleShareMenuToggle = (isOpen: boolean) => {
    setIsShareMenuOpen(isOpen)
    if (isMobile && isOpen) {
      setIsAddMenuOpen(false)
      setIsEditMenuOpen(false)
    }
  }

  const handleTemplatesToggle = (isOpen: boolean) => {
    setIsTemplatesOpen(isOpen)
  }

  const handleElementsToggle = (isOpen: boolean) => {
    setIsElementsOpen(isOpen)
  }

  const handleBlocksToggle = (isOpen: boolean) => {
    setIsBlocksOpen(isOpen)
  }

  const handleUploadToggle = (isOpen: boolean) => {
    setIsUploadOpen(isOpen)
  }

  // Simplified text formatting toggle - just open/close without complex logic
  const handleTextFormattingToggle = (isOpen: boolean) => {
    setIsTextFormattingOpen(isOpen)
  }

  // Simplified element editing toggle
  const handleElementEditingToggle = (isOpen: boolean) => {
    setIsElementEditingOpen(isOpen)
  }

  const handleCanvasToggle = (isOpen: boolean) => {
    setIsCanvasOpen(isOpen)
  }

  const handleLayersToggle = (isOpen: boolean) => {
    setIsLayersOpen(isOpen)
  }

  const handleAIToolsToggle = (isOpen: boolean) => {
    setIsAIToolsOpen(isOpen)
  }

  const handlePrintToggle = (isOpen: boolean) => {
    setIsPrintOpen(isOpen)
  }

  const handleDownloadToggle = (isOpen: boolean) => {
    setIsDownloadOpen(isOpen)
  }

  const handleMarketplaceToggle = (isOpen: boolean) => {
    setIsMarketplaceOpen(isOpen)
  }

  const handleElementTypeSelect = (elementType: "text" | "graphic" | null) => {
    setSelectedElementType(elementType)

    // Close Add menu when an element is selected
    if (elementType !== null && isAddMenuOpen) {
      setIsAddMenuOpen(false)
    }
  }

  const handleAddText = (textType: "heading" | "body") => {
    setAddTextTrigger({ type: textType, timestamp: Date.now() })
  }

  const handleFitToScreen = () => {
    setFitToScreen(!fitToScreen)
  }

  // Enhanced zoom handling - disables fit-to-screen when manual zoom is used
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    // Disable fit-to-screen when user manually changes zoom
    if (fitToScreen) {
      setFitToScreen(false)
    }
  }

  const handleUndo = () => {
    console.log("Undo action")
    setCanRedo(true)
  }

  const handleRedo = () => {
    console.log("Redo action")
    setCanUndo(true)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Canvas management callbacks
  const handleAddCanvas = () => {
    console.log("Canvas added")
    // Additional logic for canvas addition can be added here
  }

  const handleDeleteCanvas = (canvasId: string) => {
    console.log("Canvas deleted:", canvasId)
    // Additional logic for canvas deletion can be added here
  }

  const shouldHideTextFormatting =
    isUploadOpen ||
    isTemplatesOpen ||
    isElementsOpen ||
    isBlocksOpen ||
    isCanvasOpen ||
    isLayersOpen ||
    isAIToolsOpen ||
    isPrintOpen ||
    isDownloadOpen ||
    isMarketplaceOpen ||
    isElementEditingOpen

  return (
    <>
      {/* Show main content only when welcome modal is closed */}
      {!isWelcomeModalOpen && (
        <>
          {/* main content */}
          <div className="h-screen flex flex-col bg-background overflow-hidden">
            <div className="flex-shrink-0">
              <Header
                basketItemCount={basketItemCount}
                onBasketClick={handleBasketClick}
                isMobile={isMobile}
                onMobileMenuToggle={handleMobileMenuToggle}
                isMobileMenuOpen={isMobileMenuOpen}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearchTermChange}
                onSearchFocus={handleSearchFocus}
                onUpgradeClick={handleUpgradeClick}
                onUserLibraryClick={handleUserLibraryClick}
              />
            </div>

            <PolotnoContainer className="flex flex-col relative">
              {/* Toolbar */}
              <div className="flex-shrink-0">
                <Toolbar
                  onAddMenuToggle={handleAddMenuToggle}
                  onEditMenuToggle={handleEditMenuToggle}
                  onShareMenuToggle={handleShareMenuToggle}
                  onTemplatesToggle={handleTemplatesToggle}
                  onElementsToggle={handleElementsToggle}
                  onBlocksToggle={handleBlocksToggle}
                  onUploadToggle={handleUploadToggle}
                  onTextFormattingToggle={handleTextFormattingToggle}
                  onElementEditingToggle={handleElementEditingToggle}
                  onCanvasToggle={handleCanvasToggle}
                  onLayersToggle={handleLayersToggle}
                  onAIToolsToggle={handleAIToolsToggle}
                  onPrintToggle={handlePrintToggle}
                  onDownloadToggle={handleDownloadToggle}
                  onMarketplaceToggle={handleMarketplaceToggle}
                  isTextFormattingOpen={
                    isTextFormattingOpen && !shouldHideTextFormatting
                  }
                  isElementEditingOpen={isElementEditingOpen}
                  isUploadOpen={isUploadOpen}
                  isCanvasOpen={isCanvasOpen}
                  isLayersOpen={isLayersOpen}
                  isAIToolsOpen={isAIToolsOpen}
                  isPrintOpen={isPrintOpen}
                  isDownloadOpen={isDownloadOpen}
                  isMarketplaceOpen={isMarketplaceOpen}
                  isBlocksOpen={isBlocksOpen}
                  selectedElementType={selectedElementType}
                  onAddText={handleAddText}
                  // Enhanced Canvas toolbar props with functional zoom
                  tool={tool}
                  setTool={setTool}
                  zoom={zoom}
                  setZoom={handleZoomChange} // Use enhanced zoom handler
                  fitToScreen={fitToScreen}
                  handleFitToScreen={handleFitToScreen}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  handleUndo={handleUndo}
                  handleRedo={handleRedo}
                  // Basket props
                  onAddToBasket={handleAddToBasket}
                  // Mobile props
                  isMobile={isMobile}
                  isTablet={isTablet}
                  screenSize={screenSize}
                  isMobileMenuOpen={isMobileMenuOpen}
                  // Pass additional state to help with text highlighting
                  shouldHideTextFormatting={shouldHideTextFormatting}
                  store={store}
                />
              </div>

              {/* Main Content Area - Clean Canvas with centered search bar */}
              <div className="flex-1 overflow-hidden relative">
                <Canvas
                  onTextFormattingToggle={handleTextFormattingToggle}
                  onElementEditingToggle={handleElementEditingToggle}
                  onElementTypeSelect={handleElementTypeSelect}
                  addTextTrigger={addTextTrigger}
                  zoom={zoom}
                  fitToScreen={fitToScreen}
                  tool={tool}
                  isMobile={isMobile}
                  isTablet={isTablet}
                  onAddCanvas={handleAddCanvas}
                  onDeleteCanvas={handleDeleteCanvas}
                />
              </div>
            </PolotnoContainer>
          </div>
        </>
      )}

      {/* Welcome Modal - Show based on state */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={handleWelcomeModalClose}
      />

      {/* Basket Modal */}
      <div className="z-[9999]">
        <BasketModal
          isOpen={isBasketModalOpen}
          onClose={handleBasketModalClose}
          basketItems={basketItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearBasket={handleClearBasket}
        />
      </div>

      {/* Search Modal */}
      <div className="z-[9999]">
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={handleSearchModalClose}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          isMobile={isMobile}
        />
      </div>

      {/* Upgrade Modal */}
      <div className="z-[9999]">
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={handleUpgradeModalClose}
          isMobile={isMobile}
        />
      </div>

      {/* User Library Modal */}
      <div className="z-[9999]">
        <UserLibraryModal
          isOpen={isUserLibraryModalOpen}
          onClose={handleUserLibraryModalClose}
          isMobile={isMobile}
        />
      </div>
    </>
  )
}
