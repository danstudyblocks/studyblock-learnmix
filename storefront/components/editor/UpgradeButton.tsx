'use client'
import React from 'react'
import Image from "next/image"
import { useRouter } from 'next/navigation'
import diamond_icon from "@/public/design-edit-icons-and-svgs/icons/diamond_icon.svg"
import { upgradeToPremium } from '@/lib/data/vendor'

interface UpgradeButtonProps {
    priceId: string
    className?: string
    children?: React.ReactNode
    creator_id?: string
    email?: string
    isPremium?: boolean
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({
    priceId,
    className = '',
    children,
    creator_id,
    email,
    isPremium
}) => {
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter()

    const handleUpgrade = async () => {
        if (isPremium) {
            // Navigate to subscription management/billing page
            // router.push('/subscription/manage')
            return
        }

        if (!creator_id || !email) {
            router.push('/sign-in')
            return
        }

        setIsLoading(true)
        try {
            const origin = window.location.origin

            const response = await upgradeToPremium({
                priceId,
                successUrl: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${origin}/subscription/cancel`,
                creator_id,
                email
            })

            const url = (response as any).url
            if (url) {
                window.location.href = url
            } else {
                throw new Error('No checkout URL returned')
            }
        } catch (error) {
            console.error('Error initiating checkout:', error)
            alert('Failed to initiate checkout. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Premium state styling and content
    if (isPremium) {
        return (
            <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg ${className}`}
            >
                <div className="relative">
                    <Image src={diamond_icon} alt="premium diamond icon" className="w-4 h-4" />
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse"></div>
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                    {isLoading ? 'Loading...' : 'Premium Active'}
                </span>
                {/* <span className="text-xs hidden md:inline opacity-80">
                    • Manage
                </span> */}
            </button>
        )
    }

    // Default upgrade state
    return (
        <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className={`flex items-center justify-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
        >
            <Image src={diamond_icon} alt="diamond icon" className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
                {isLoading ? 'Processing...' : children || 'Upgrade to Premium'}
            </span>
            {isLoading && (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin ml-1"></div>
            )}
        </button>
    )
}

export default UpgradeButton