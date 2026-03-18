"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User, LogOut, UserCircle, Package, Heart, Newspaper, HelpCircle, Mail, Shield, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface SimpleHeaderProps {
  showEditorButton?: boolean
  showUserMenu?: boolean
}

export default function SimpleHeader({
  showEditorButton = false,
  showUserMenu = true,
}: SimpleHeaderProps) {
  const router = useRouter()
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)
  const avatarMenuRef = useRef<HTMLDivElement>(null)

  const handleAvatarClick = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen)
  }

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
    document.cookie = '_medusa_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    localStorage.clear()
    window.location.href = '/account/login'
  }

  return (
    <div className="h-16 sm:h-20 bg-white border-b border-border flex items-center px-4 sm:px-8 relative z-40">
      {/* Left Section - Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <h1
            className="text-2xl font-light text-gray-900 tracking-tight"
            style={{ fontFamily: "Figtree, sans-serif" }}
          >
            learnmix
          </h1>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {showEditorButton && (
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/design-studio')}
            className="h-10 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <span className="text-sm font-medium">Editor</span>
          </Button>
        )}

        {showUserMenu && (
          <div className="flex items-center relative" ref={avatarMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAvatarClick}
              className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full overflow-hidden transition-all duration-200 hover:scale-105"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">D</span>
              </div>
            </Button>

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
        )}
      </div>
    </div>
  )
}
