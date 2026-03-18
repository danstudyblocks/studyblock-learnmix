import Image from "next/image"
import dummy_profile from "@/public/design-edit-icons-and-svgs/icons/dummy_profile.svg"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Home } from "lucide-react"

const MinimalisticHeader = ({ customer }: any) => {
  const [avatar_url, setAvatarUrl] = useState("")

  useEffect(() => {
    const avatarUrl = customer?.metadata?.avatar_url
    setAvatarUrl(avatarUrl)
  }, [customer])

  return (
    <header className="h-14 px-6 border-b border-gray-200 bg-headerBg">
      <div className="h-full flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Link href={"/"} className="font-light text-[18px] leading-tight tracking-tight" style={{ fontFamily: '"Souvenir Std", Georgia, serif' }}>
            Learnmix
          </Link>
        </div>

        {/* Right - Home and Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </Link>

          {customer ? (
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              {avatar_url ? (
                <Image
                  src={avatar_url}
                  alt="profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-700 text-sm font-semibold">
                    {customer?.first_name?.charAt(0)?.toUpperCase() || customer?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-up"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign up
              </Link>
              <Link
                href="/sign-in"
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default MinimalisticHeader
