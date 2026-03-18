import { createStep } from '@medusajs/framework/workflows-sdk'
import { PAYOUT_MODULE } from '../../../modules/payout'

export const createOnboardingStep = createStep(
  'create-onboarding',
  async (input: { customer_id: string; context: any; payout_account_id: string }, { container }) => {
    const payoutService = container.resolve(PAYOUT_MODULE)

    const onboarding = await payoutService.initializeOnboarding({
      context: input.context,
      payout_account_id: input.payout_account_id
    })

    return { payout_account_id: onboarding.id, ...onboarding }
  }
)
