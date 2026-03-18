import { createStep } from '@medusajs/framework/workflows-sdk'
import { PAYOUT_MODULE } from '../../../modules/payout'

export const createStripeConnectAccountStep = createStep(
  'create-stripe-connect-account',
  async (input: { customer_id: string; email: string; country: string }, { container }) => {
    const payoutService = container.resolve(PAYOUT_MODULE)

    // Create Stripe Connect account
    const connectAccount = await payoutService.createPayoutAccount({
      context: {
        type: 'express',
        country: input.country,
        email: input.email,
        business_type: 'individual'
      },
      account_id: input.customer_id
    })

    return connectAccount
  }
)
