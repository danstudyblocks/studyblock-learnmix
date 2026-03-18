import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk'
import { createStripeConnectAccountStep } from '../steps/create-stripe-connect-account'

export const createStripeConnectAccountWorkflow = createWorkflow(
  'create-stripe-connect-account',
  function (input: { customer_id: string; email: string; country: string }) {
    const connectAccount = createStripeConnectAccountStep(input)

    return new WorkflowResponse(connectAccount)
  }
)
