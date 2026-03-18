import { createStep } from '@medusajs/framework/workflows-sdk'
import { PAYOUT_MODULE } from '../../../modules/payout'

export const createPayoutAccountStep = createStep(
  'create-payout-account',
  async (input: { customer_id: string; context: any }, { container }) => {
    const payoutService = container.resolve(PAYOUT_MODULE)

    const payoutAccount = await payoutService.createPayoutAccount({
      context: {
        ...input.context,
        account_id: input.customer_id
      }
    })

    return { id: payoutAccount.id, ...payoutAccount }
  }
)
