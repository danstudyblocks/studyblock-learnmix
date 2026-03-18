"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { verifySubscription } from "@/lib/data/vendor"

export default function SubscriptionSuccessPageContent() {
    const searchParams = useSearchParams()
    const session_id = searchParams.get("session_id")
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!session_id) return

        const verifySession = async () => {
            try {
                const response = await verifySubscription(session_id)
                if (!response.success) {
                    const error = await response.json()
                    throw new Error(error.message || "Failed to verify subscription")
                }
                setStatus("success")
            } catch (error) {
                console.error("Error verifying subscription:", error)
                setStatus("error")
                //@ts-ignore
                setMessage(error.message || "Something went wrong. Please contact support.")
            }
        }

        verifySession()
    }, [session_id])

    return (
        <div className="max-w-lg mx-auto h-screen mt-16 p-6 bg-white rounded-lg shadow-md">
            {status === "loading" && (
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Processing your subscription...</h1>
                    <p>Please wait while we set up your account.</p>
                </div>
            )}

            {status === "success" && (
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Subscription Successful!</h1>
                    <p className="mb-6">Thank you for upgrading! Your premium features are now unlocked.</p>
                    <div className="mt-8">
                        <Link href="/dashboard/home" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <p className="mb-4 text-red-600">{message}</p>
                    <p>If you believe your payment was processed successfully, please contact our support team for assistance.</p>
                    <div className="mt-8">
                        <Link href="/contact" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Contact Support
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
