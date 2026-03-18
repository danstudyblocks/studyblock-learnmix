"use server"
import axios from "axios";
import { getAuthHeaders } from "./cookies";
import { revalidateTag } from "next/cache";

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_API_KEY!,
  },
});

export interface PayoutAccount {
  id: string
  status: 'pending' | 'active' | 'disabled'
  reference_id?: string
  data?: any
  created_at: string
  updated_at: string
}

export interface Payout {
  id: string
  amount: number
  currency_code: string
  status: string
  created_at: string
  data?: any
}

export interface CreatePayoutAccountRequest {
  context: {
    type: 'express'
    email: string
  }
}

export interface CreateOnboardingRequest {
  context: Record<string, any>
}

/**
 * Fetch the payout account for the authenticated customer
 */
export async function getPayoutAccount(): Promise<{ success: boolean; payout_account?: PayoutAccount; error?: string }> {
  try {
    const headers = {
      ...apiClient.defaults.headers.common,
      ...getAuthHeaders(),
    };

    const { data } = await apiClient.get("/vendor/payout-account", { headers });

    return { 
      success: true, 
      payout_account: data.payout_account 
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { success: true, payout_account: undefined };
    }
    
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch payout account";
    return { success: false, error: errorMessage };
  }
}

/**
 * Create a new Stripe Connect payout account for the customer
 */
export async function createPayoutAccount(
  request: CreatePayoutAccountRequest
): Promise<{ success: boolean; payout_account?: PayoutAccount; error?: string }> {
  try {
    const headers = {
      ...apiClient.defaults.headers.common,
      ...getAuthHeaders(),
    };

    const { data } = await apiClient.post("/vendor/payout-account", request, { headers });

    revalidateTag("payout-account");
    return { 
      success: true, 
      payout_account: data.payout_account 
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to create payout account";
    return { success: false, error: errorMessage };
  }
}

/**
 * Start Stripe Connect onboarding process
 */
export async function startOnboarding(
  request: CreateOnboardingRequest
): Promise<{ success: boolean; payout_account?: PayoutAccount; error?: string }> {
  try {
    const headers = {
      ...apiClient.defaults.headers.common,
      ...getAuthHeaders(),
    };

    const { data } = await apiClient.post("/vendor/payout-account/onboarding", request, { headers });

    revalidateTag("payout-account");
    return { 
      success: true, 
      payout_account: data.payout_account 
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to start onboarding";
    return { success: false, error: errorMessage };
  }
}

/**
 * Fetch payout history for the authenticated customer
 */
export async function getPayoutHistory(): Promise<{ success: boolean; payouts?: Payout[]; error?: string }> {
  try {
    const headers = {
      ...apiClient.defaults.headers.common,
      ...getAuthHeaders(),
    };

    const { data } = await apiClient.get("/vendor/payouts", { headers });

    return { 
      success: true, 
      payouts: data.payouts || [] 
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch payout history";
    return { success: false, error: errorMessage };
  }
}

/**
 * Sync Stripe Connect account (placeholder for future implementation)
 */
export async function syncStripeAccount(): Promise<{ success: boolean; payout_account?: PayoutAccount; error?: string }> {
  try {
    const headers = {
      ...apiClient.defaults.headers.common,
      ...getAuthHeaders(),
    };

    const { data } = await apiClient.post("/vendor/payout-account/sync", {}, { headers });

    revalidateTag("payout-account");
    return { 
      success: true, 
      payout_account: data.payout_account 
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to sync Stripe account";
    return { success: false, error: errorMessage };
  }
}
