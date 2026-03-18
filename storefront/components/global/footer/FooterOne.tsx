import Link from 'next/link'
import { FaYoutube, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

const footerLinks = {
  help: [
    { name: "FAQ'S", href: '/faq' },
    { name: 'Terms & Conditions', href: '/terms-conditions' },
    { name: 'Contact us', href: '/contact' },
  ],
  store: [
    { name: 'Shop posters', href: '#' },
    { name: 'Shop worksheets', href: '#' },
    { name: 'Shop books', href: '#' },
    { name: 'Shop stickers', href: '#' },
  ],
  designer: [
    { name: 'Sign up', href: '/sign-up' },
    { name: 'New templates', href: '/' },
    { name: 'Print on demand', href: '/' },
    { name: 'Design Editor', href: '/design-edit' },
  ],
  social: [
    { name: 'YouTube', icon: FaYoutube, href: '#' },
    { name: 'Facebook', icon: FaFacebookF, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'LinkedIn', icon: FaLinkedinIn, href: '#' },
  ],
}

function FooterOne() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-12 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* HELP Section */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-black font-bold text-lg mb-4 text-center md:text-left">HELP</h3>
              <ul className="space-y-3 text-center md:text-left">
                {footerLinks.help.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[#0765FF] text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* STORE Section */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-black font-bold text-lg mb-4 text-center md:text-left">STORE</h3>
              <ul className="space-y-3 text-center md:text-left">
                {footerLinks.store.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[#0765FF] text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* DESIGN EDITOR Section */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-black font-bold text-lg mb-4 text-center md:text-left">DESIGN EDITOR</h3>
              <ul className="space-y-3 text-center md:text-left">
                {footerLinks.designer.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-[#0765FF] text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* JOIN US Section */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-black font-bold text-lg mb-4 text-center md:text-left">JOIN US</h3>
              <div className="flex gap-4 justify-center md:justify-start">
                {footerLinks.social.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="text-gray-600 hover:text-[#0765FF] transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center md:text-left">
            Learnmix limited @ {currentYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default FooterOne