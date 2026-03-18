"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ShoppingBasket, Menu, X, User, UserCircle, Package, Heart, Newspaper, HelpCircle, Mail, Shield, FileText, LogOut } from "lucide-react"
import { ImageWithFallback } from "./ImageWithFallback"
import { useMobile } from "./use-mobile"
import { useRouter } from "next/navigation"
// import avatarImage from 'figma:asset/8c79166971cb1aea3eacec3d6c81e3763364c51a.png';

interface ToolbarProps {
  basketItemCount: number
  onBasketClick: () => void
  isMobile?: boolean
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  onSearchFocus?: () => void
  onUpgradeClick?: () => void
  onUserLibraryClick?: () => void
}

export function Header({
  basketItemCount,
  onBasketClick,
  isMobile = false,
  onMobileMenuToggle = () => {},
  isMobileMenuOpen = false,
  searchTerm = "",
  onSearchTermChange = () => {},
  onSearchFocus = () => {},
  onUpgradeClick = () => {},
  onUserLibraryClick = () => {},
}: ToolbarProps) {
  const { screenSize } = useMobile()
  const router = useRouter()
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const avatarMenuRef = useRef<HTMLDivElement>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(e.target.value)
  }

  const handleMobileSearchClick = () => {
    onSearchFocus()
  }

  const handleAvatarClick = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false)
      }
    }

    if (isAvatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAvatarMenuOpen])

  const handleLogout = () => {
    // Clear auth tokens
    document.cookie = '_medusa_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    localStorage.clear()
    window.location.href = '/account/login'
  }

  //   const avatarImage = "blob:https://33c86982-c819-455d-a29b-66c7f55d2b8d-figmaiframepreview.figma.site/23d4469b-ffac-429d-b181-9ef69fe879a3#filename=8c79166971cb1aea3eacec3d6c81e3763364c51a.png"

  return (
    <div className="h-16 sm:h-20 bg-white border-b border-border flex items-center px-4 sm:px-8 relative z-40">
      {/* Left Section - Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="h-10 w-10 p-0 hover:bg-gray-100 md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        )}

        {/* Logo */}
        <div className="flex items-center">
          <h1
            className="text-2xl font-light text-gray-900 tracking-tight"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            learnmix
          </h1>
        </div>
      </div>

      {/* Center Section - Search Bar */}
      <div className="hidden sm:flex flex-1 justify-center px-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates, elements..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={onSearchFocus}
            className="pl-10 pr-4 h-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMobileSearchClick}
          className="h-10 w-10 p-0 hover:bg-gray-100 sm:hidden"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </Button>

        {/* User Avatar - Hidden on mobile in favor of mobile menu */}
        <div className="hidden sm:flex items-center relative" ref={avatarMenuRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAvatarClick}
            className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full overflow-hidden transition-all duration-200 hover:scale-105"
          >
            {/* <ImageWithFallback
            //   src={"blob:https://33c86982-c819-455d-a29b-66c7f55d2b8d-figmaiframepreview.figma.site/23d4469b-ffac-429d-b181-9ef69fe879a3#filename=8c79166971cb1aea3eacec3d6c81e3763364c51a.png"}
              src={avatarImage}
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover"
            /> */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">D</span>
            </div>
          </Button>

          {/* Avatar Dropdown Menu */}
          {isAvatarMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
              <button
                onClick={() => {
                  router.push('/profile')
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <UserCircle className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">Profile</span>
              </button>

              <button
                onClick={() => {
                  router.push('/account/orders')
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">My Resources</span>
              </button>

              <button
                onClick={() => {
                  router.push('/')
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Heart className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">My Favourites</span>
              </button>

              <button
                onClick={() => {
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Newspaper className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">Newsletter</span>
              </button>

              <button
                onClick={() => {
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">Help</span>
              </button>

              <button
                onClick={() => {
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">Contact Us</span>
              </button>

              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={() => {
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">Privacy Policy</span>
              </button>

              <button
                onClick={() => {
                  setIsAvatarMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 text-sm">Terms of Service</span>
              </button>

              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-red-500 text-sm font-medium">Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Basket */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBasketClick}
            className="h-10 w-10 sm:w-auto sm:px-3 p-0 sm:p-2 hover:bg-gray-100 relative"
          >
            <ShoppingBasket className="w-5 h-5 text-gray-600" />
            <span className="hidden sm:inline-block ml-2 text-sm text-gray-700">
              Basket
            </span>
            {basketItemCount > 0 && (
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm text-white font-medium">
                  {basketItemCount > 99 ? "99+" : basketItemCount}
                </span>
              </div>
            )}
          </Button>
        </div>

        {/* Upgrade Button - Hidden on mobile */}
        <Button
          variant="default"
          size="sm"
          onClick={onUpgradeClick}
          className="hidden sm:inline-flex h-10 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
        >
          <span className="text-sm font-medium">Upgrade</span>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-50 md:hidden">
          <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates, elements..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={onSearchFocus}
                className="pl-10 pr-4 h-12 bg-gray-50 border-0 text-base"
              />
            </div>

            {/* Mobile Menu Items */}
            <div className="space-y-2">
              {/* Mobile Avatar & Profile */}
              <div
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={handleAvatarClick}
              >
                {/* <ImageWithFallback
                //   src={"blob:https://33c86982-c819-455d-a29b-66c7f55d2b8d-figmaiframepreview.figma.site/23d4469b-ffac-429d-b181-9ef69fe879a3#filename=8c79166971cb1aea3eacec3d6c81e3763364c51a.png"}
                  src={avatarImage}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
                /> */}
                <User className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-medium text-gray-900">My Library</div>
                  <div className="text-sm text-gray-500">
                    Templates &amp; assets
                  </div>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                onClick={onUpgradeClick}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
