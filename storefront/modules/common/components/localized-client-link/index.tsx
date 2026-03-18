"use client"

import Link from "next/link"
import React from "react"

/**
 * A simple wrapper for Next.js `<Link />` that no longer includes `countryCode` in the URL.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
