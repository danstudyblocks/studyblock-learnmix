"use client"
import React, { useState, useEffect } from "react"
import { PiCreditCard, PiCheckCircle, PiWarningCircle } from "react-icons/pi"
import {
  getPayoutAccount,
  createPayoutAccount,
  startOnboarding,
  type PayoutAccount,
} from "@/lib/data/stripe-connect"
import { getBaseURL } from "@/lib/util/env"

interface StripeConnectSetupProps {
  customer: any
  onSuccess?: (account: PayoutAccount) => void
}

const StripeConnectSetup: React.FC<StripeConnectSetupProps> = ({
  customer,
  onSuccess,
}) => {
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    fetchPayoutAccount()
  }, [customer?.id])

  const fetchPayoutAccount = async () => {
    try {
      const { success, payout_account, error } = await getPayoutAccount()

      if (success) {
        setPayoutAccount(payout_account || null)

        // Auto-sync status if account exists but is not active
        if (payout_account) {
          const actualPayoutAccount =
            (payout_account as any).payout_account || payout_account
          if (actualPayoutAccount.status !== "active") {
            await syncPayoutAccount()
          }
        }
      } else {
        setError(error || "Failed to fetch payout account")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const syncPayoutAccount = async () => {
    try {
      const { success, payout_account, error } = await getPayoutAccount()

      if (success) {
        setPayoutAccount(payout_account || null)
      }
    } catch (err) {
      // Silent error handling for sync
    }
  }

  const handleCreatePayoutAccount = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const requestData = {
        context: {
          type: "express" as const,
          email: customer.email,
        },
      }

      const { success, payout_account, error } = await createPayoutAccount(
        requestData
      )

      if (success && payout_account) {
        setPayoutAccount(payout_account)
        onSuccess?.(payout_account)
      } else {
        setError(error || "Failed to create payout account")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsCreating(false)
    }
  }

  const handleSyncStatus = async () => {
    setIsSyncing(true)
    setError(null)

    try {
      await syncPayoutAccount()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleStartOnboarding = async () => {
    try {
      const requestData = {
        context: {
          refresh_url: `${getBaseURL()}/dashboard/home`,
          return_url: `${getBaseURL()}/dashboard/home`,
        },
      }

      const { success, payout_account, error } = await startOnboarding(
        requestData
      )

      if (success && payout_account) {
        // Redirect to Stripe Connect onboarding
        const onboardingUrl =
          payout_account.data?.onboarding_url ||
          (payout_account as any).onboarding?.data?.onboarding_url

        if (onboardingUrl) {
          window.open(onboardingUrl, "_blank")
        }
      } else {
        setError(error || "Failed to start onboarding")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!payoutAccount) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <PiCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Set up Stripe Connect
          </h3>
          <p className="text-gray-600 mb-6">
            Connect your Stripe account to receive payouts from your sales.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <PiWarningCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleCreatePayoutAccount}
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Creating..." : "Connect Stripe Account"}
          </button>
        </div>
      </div>
    )
  }

  // Extract the actual payout account data from nested structure
  const actualPayoutAccount =
    (payoutAccount as any).payout_account || payoutAccount

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <PiCreditCard className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Stripe Connect Account
            </h3>
            <p className="text-sm text-gray-600">
              Account ID: {actualPayoutAccount.reference_id || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actualPayoutAccount.status === "active" ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <PiCheckCircle className="h-4 w-4 mr-1" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <PiWarningCircle className="h-4 w-4 mr-1" />
              {actualPayoutAccount.status === "pending"
                ? "Pending"
                : "Disabled"}
            </span>
          )}

          <button
            onClick={handleSyncStatus}
            disabled={isSyncing}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
          >
            {isSyncing ? "Syncing..." : "Sync Status"}
          </button>
        </div>
      </div>

      {actualPayoutAccount.status === "pending" && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            Complete your Stripe Connect onboarding to start receiving payouts.
          </p>
          <button
            onClick={handleStartOnboarding}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Complete Onboarding
          </button>
        </div>
      )}

      {actualPayoutAccount.status === "active" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Your Stripe Connect account is active and ready to receive payouts!
          </p>
        </div>
      )}
    </div>
  )
}

export default StripeConnectSetup
