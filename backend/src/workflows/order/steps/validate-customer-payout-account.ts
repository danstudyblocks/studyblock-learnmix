import { createStep } from '@medusajs/framework/workflows-sdk'
import { MedusaError, ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { PayoutAccountStatus } from '../../../modules/payout/types'
import sellerPayoutAccount from '../../../links/customer-payout-account'

export const validateCustomerPayoutAccountStep = createStep(
  'validate-customer-payout-account',
  async (customer: any, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    // Query the payout account relation
    const {
      data: [payoutAccountRelation]
    } = await query.graph({
      entity: sellerPayoutAccount.entryPoint,
      fields: ['payout_account_id'],
      filters: {
        customer_id: customer.id
      }
    })

    if (!payoutAccountRelation) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Customer has no payout account'
      )
    }

    // Query the payout account details
    const {
      data: [payoutAccount]
    } = await query.graph({
      entity: 'payout_account',
      fields: ['*'],
      filters: {
        id: payoutAccountRelation.payout_account_id
      }
    })

    if (!payoutAccount) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Payout account not found'
      )
    }

    if (payoutAccount.status !== PayoutAccountStatus.ACTIVE) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Customer payout account is not active'
      )
    }

    return {
      ...customer,
      payout_account: payoutAccount
    }
  }
)
