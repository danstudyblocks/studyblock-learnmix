import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import Stripe from 'stripe'

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      //@ts-ignore
      apiVersion: '2025-06-30.basil'
    })

    // Test basic API access
    const balance = await stripe.balance.retrieve()
    
    // Test Connect API access - try to create a test account
    try {
      const accounts = await stripe.accounts.list({ limit: 1 })
      
      // Try to create a test account to verify Connect permissions
      try {
        const testAccount = await stripe.accounts.create({
          type: 'express',
          country: 'US',
          email: 'test@example.com',
          business_type: 'individual',
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true }
          }
        })
        
        // Delete the test account immediately
        await stripe.accounts.del(testAccount.id)
        
        res.json({
          success: true,
          message: 'Stripe API and Connect are working',
          balance: balance.available[0]?.amount || 0,
          currency: balance.available[0]?.currency || 'usd',
          connectEnabled: true,
          accountsCount: accounts.data.length,
          testAccountCreated: true
        })
      } catch (createError) {
        res.json({
          success: true,
          message: 'Stripe API is working but Connect account creation failed',
          balance: balance.available[0]?.amount || 0,
          currency: balance.available[0]?.currency || 'usd',
          connectEnabled: false,
          createError: createError.message,
          accountsCount: accounts.data.length
        })
      }
    } catch (connectError) {
      res.json({
        success: true,
        message: 'Stripe API is working but Connect is not enabled',
        balance: balance.available[0]?.amount || 0,
        currency: balance.available[0]?.currency || 'usd',
        connectEnabled: false,
        connectError: connectError.message
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
