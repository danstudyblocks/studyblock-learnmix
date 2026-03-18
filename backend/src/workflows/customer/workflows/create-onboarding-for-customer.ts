import { createWorkflow, WorkflowResponse, transform } from '@medusajs/framework/workflows-sdk'
import { createOnboardingStep } from '../steps/create-onboarding'
import { getPayoutAccountForCustomerStep } from '../steps/get-payout-account-for-customer'

export const createOnboardingForCustomerWorkflow = createWorkflow(
  'create-onboarding-for-customer',
  function (input: { customer_id: string; context: any }) {
    const payoutAccount = getPayoutAccountForCustomerStep(input)
    
    const payoutAccountId = transform(payoutAccount, (account: any) => {
      if (!account) {
        throw new Error('No payout account found for customer. Please create a payout account first.')
      }
      if (!account.id) {
        throw new Error('Payout account ID is missing. The payout account is invalid.')
      }
      return account.id
    })
    
    const onboarding = createOnboardingStep({
      customer_id: input.customer_id,
      context: input.context,
      payout_account_id: payoutAccountId
    })

    return new WorkflowResponse(onboarding)
  }
)
