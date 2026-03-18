import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk'
import { createRemoteLinkStep } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'
import { PAYOUT_MODULE } from '../../../modules/payout'
import { createPayoutAccountStep } from '../steps/create-payout-account'

export const createPayoutAccountForCustomerWorkflow = createWorkflow(
  'create-payout-account-for-customer',
  function (input: { customer_id: string; context: any }) {
    const payoutAccount = createPayoutAccountStep(input)
    
    const linkResult = createRemoteLinkStep([
      {
        [Modules.CUSTOMER]: {
          customer_id: input.customer_id
        },
        [PAYOUT_MODULE]: {
          payout_account_id: payoutAccount.id
        }
      }
    ])

    return new WorkflowResponse(payoutAccount)
  }
)
