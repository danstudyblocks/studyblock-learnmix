"use client"
export const dynamic = "force-dynamic"

import React, { Suspense } from "react"
import SubscriptionSuccessPageContent from "../content"

export default function SubscriptionSuccessPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <SubscriptionSuccessPageContent />
        </Suspense>
    )
}
