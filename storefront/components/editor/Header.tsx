"use client"

import Image from "next/image"
import dummy_profile from "@/public/design-edit-icons-and-svgs/icons/dummy_profile.svg"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"
import {
  Home,
  User,
  Menu,
  X,
  UserCircle,
  Package,
  Heart,
  Newspaper,
  HelpCircle,
  Mail,
  Shield,
  FileText,
  LogOut,
  Printer,
} from "lucide-react"
import { PrintOrderModal } from "./PrintOrderModal"

interface HeaderProps {
  customer?: any
  store?: any
}

const Header = observer(({ customer, store }: HeaderProps) => {
  const [avatar_url, setAvatarUrl] = useState("")
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const avatarMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const url = customer?.metadata?.avatar_url
    setAvatarUrl(url || "")
  }, [customer])

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false)
      }
    }

    if (showAvatarMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAvatarMenu])

  const handleLogout = () => {
    // Clear auth tokens
    document.cookie = '_medusa_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    localStorage.clear()
    window.location.href = '/account/login'
  }

  return (
    <>
    <header className="w-full border-b border-gray-200 bg-[#FCFAF8]">
      {/* Top bar: logo (left) | Home + Profile (right) - full width */}
      <div className="w-full h-14 flex items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="font-light text-2xl leading-tight tracking-tight text-gray-900"
          style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}
        >
          learnmix
        </Link>
        <div className="flex items-center gap-3 relative">
          {/* Buy a Print */}
          {store && (
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#7b5cff] hover:bg-[#6548e0] transition-colors text-sm font-semibold text-white"
            >
              <Printer className="w-4 h-4" />
              <span>Buy a Print</span>
            </button>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          {customer ? (
            <div className="relative" ref={avatarMenuRef}>
              <button
                type="button"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center p-0 border-0 hover:opacity-90 transition-opacity"
                title="Profile"
              >
                {avatar_url ? (
                  <Image
                    src={avatar_url}
                    alt="profile"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-700 text-sm font-semibold">
                      {customer?.first_name?.charAt(0)?.toUpperCase() || customer?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </button>

              {/* Avatar Dropdown Menu */}
              {showAvatarMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      router.push('/profile')
                      setShowAvatarMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <UserCircle className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push('/account/orders')
                      setShowAvatarMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Package className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">My Resources</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push('/')
                      setShowAvatarMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Heart className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">My Favourites</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAvatarMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Newspaper className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">Newsletter</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAvatarMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">Help</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAvatarMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">Contact Us</span>
                  </button>

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={() => {
                      setShowAvatarMenu(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 text-sm">Privacy Policy</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAvatarMenu(false)
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
          ) : (
            <Link
              href="/sign-in"
              className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Profile"
            >
              <User className="w-5 h-5 text-white" />
            </Link>
          )}
        </div>
      </div>

    </header>

    {showPrintModal && store && (
      <PrintOrderModal
        store={store}
        customer={customer}
        onClose={() => setShowPrintModal(false)}
      />
    )}
  </>
  )
})

export default Header
