"use client"
import { Badge } from "@medusajs/ui"
import { useState, useEffect } from "react"

const PaymentTest = ({ className }: { className?: string }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevents rendering on the server

  return (
    <Badge color="orange" className={className}>
      <span className="font-semibold">Attention:</span> For testing purposes only.
    </Badge>
  )
}

export default PaymentTest
