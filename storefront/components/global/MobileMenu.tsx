import logo from "@/public/images/logo_white.png"
import Image from "next/image"
import Link from "next/link"
import { SetStateAction } from "react"
import AnimateHeight from "react-animate-height"
import { PiCaretRight, PiX, PiMagnifyingGlass } from "react-icons/pi"
import { headerMenu } from "../../data/data"
import useToggle from "../../hooks/useToggle"

function MobileMenu({
  showMobileMenu,
  setShowMobileMenu,
}: {
  showMobileMenu: boolean
  setShowMobileMenu: React.Dispatch<SetStateAction<boolean>>
}) {
  const { menuToggle, handleToggle } = useToggle()

  const servicesDropdown = [
    { id: 2, title: "Marketplace", href: "/marketplace-for-educators" },
    { id: 3, title: "Design Studio", href: "/design-studio" },
    { id: 5, title: "AI tools", href: "#" },
    { id: 6, title: "Upload file for design", href: "#" },
    { id: 7, title: "Bespoke exercise books", href: "/book-design-studio" },
    { id: 8, title: "Print-on-demand", href: "#" },
    { id: 9, title: "My dashboard", href: "/dashboard/home" },
    { id: 10, title: "Cart", href: "/cart" },
    { id: 11, title: "Shop", href: "/shop" },
  ]

  const aboutDropdown = [
    { id: 1, title: "For teachers", href: "#" },
    { id: 2, title: "For Schools", href: "#" },
    { id: 3, title: "FAQ's", href: "/faq" },
    { id: 4, title: "Terms & Conditions", href: "/terms-conditions" },
    { id: 5, title: "Join us", href: "/" },
    { id: 6, title: "Contact", href: "/contact" },
    { id: 7, title: "About Us", href: "/about-us" },
  ]

  return (
    <nav>
      {/* Overlay */}
      <div
        className={`${
          showMobileMenu
            ? "opacity-30 translate-y-0"
            : "opacity-0 translate-y-[-100%] delay-500"
        } fixed left-0 top-0 z-[998] h-full w-full bg-black duration-700 lg:hidden`}
        onClick={() => setShowMobileMenu(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed right-0 top-0 z-[999] flex h-full w-full 2xsm:w-[280px] xsm:w-[300px] flex-col bg-white duration-700 
        ${showMobileMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <Image src={logo} alt="logo" className="w-[100px] 2xsm:w-[120px]" />
            <button onClick={() => setShowMobileMenu(false)} className="p-1">
              <PiX className="text-xl" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-full border border-gray-300 pr-8 text-sm"
            />
            <PiMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <ul className="p-3 2xsm:p-4 space-y-2">
            <li>
              <Link
                href="/"
                className="block py-2 text-gray-800 hover:text-b500"
              >
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleToggle("services")}
                className="flex w-full items-center justify-between py-2 text-gray-800"
              >
                Services
                <PiCaretRight
                  className={`transition-transform duration-200 ${
                    menuToggle === "services" ? "rotate-90" : ""
                  }`}
                />
              </button>
              <AnimateHeight
                duration={300}
                height={menuToggle === "services" ? "auto" : 0}
              >
                <ul className="pl-4 py-2 space-y-2">
                  {servicesDropdown.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="block py-1 text-gray-600 hover:text-b500"
                      >
                        {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AnimateHeight>
            </li>
            <li>
              <button
                onClick={() => handleToggle("about")}
                className="flex w-full items-center justify-between py-2 text-gray-800"
              >
                About
                <PiCaretRight
                  className={`transition-transform duration-200 ${
                    menuToggle === "about" ? "rotate-90" : ""
                  }`}
                />
              </button>
              <AnimateHeight
                duration={300}
                height={menuToggle === "about" ? "auto" : 0}
              >
                <ul className="pl-4 py-2 space-y-2">
                  {aboutDropdown.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="block py-1 text-gray-600 hover:text-b500"
                      >
                        {item.title}
                      </Link>
            </li>
          ))}
        </ul>
              </AnimateHeight>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default MobileMenu
