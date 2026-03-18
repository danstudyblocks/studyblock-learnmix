import { createStep } from '@medusajs/framework/workflows-sdk'
import { PAYOUT_MODULE } from '@/modules/payout/'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import sellerPayoutAccountLink from '../../../links/customer-payout-account'

export const getPayoutAccountForCustomerStep = createStep(
  'get-payout-account-for-customer',
  async (input: { customer_id: string }, { container }) => {
    try {
      // Try using the link system first
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      
      const {
        data: [linkedPayoutAccount]
      } = await query.graph(
        {
          entity: sellerPayoutAccountLink.entryPoint,
          fields: ['id', 'payout_account_id', 'payout_account.id', 'payout_account.status', 'payout_account.reference_id', 'payout_account.data', 'payout_account.context', 'payout_account.created_at', 'payout_account.updated_at'],
          filters: { customer_id: input.customer_id }
        },
        { throwIfKeyNotFound: false }
      )
      
      if (linkedPayoutAccount) {
        if (linkedPayoutAccount.payout_account) {
          return linkedPayoutAccount.payout_account
        } else if (linkedPayoutAccount.payout_account_id) {
          // If we have the payout account ID but not the full object, fetch it
          const payoutService = container.resolve(PAYOUT_MODULE) as any
          const payoutAccount = await payoutService.retrievePayoutAccount(linkedPayoutAccount.payout_account_id)
          return payoutAccount
        }
      }
    } catch (error) {
      // Link system failed, try direct search
    }
    
    // Fallback to direct search using payout service
    const payoutService = container.resolve(PAYOUT_MODULE) as any
    
    // Get all payout accounts and filter by context
    const allResult = await payoutService.listPayoutAccounts({})
    const allAccounts = allResult || []
    
    const customerPayoutAccount = allAccounts.find(account => {
      return account.context?.account_id === input.customer_id
    })
    
    if (customerPayoutAccount) {
      return customerPayoutAccount
    }

    throw new Error(`No payout account found for customer: ${input.customer_id}`)
  }
)
