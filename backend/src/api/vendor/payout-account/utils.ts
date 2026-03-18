import { MedusaContainer } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import sellerPayoutAccountLink from '../../../links/customer-payout-account'

export const refetchPayoutAccount = async (
  container: MedusaContainer,
  fields: string[],
  filters: Record<string, unknown>
) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const {
      data: [sellerPayoutAccount]
    } = await query.graph(
      {
        entity: sellerPayoutAccountLink.entryPoint,
        fields,
        filters
      },
      { throwIfKeyNotFound: false }
    )

    return { payout_account: sellerPayoutAccount }
  } catch (error) {
    // If no payout account exists, return null
    console.log('ℹ️ No payout account found for customer:', filters.customer_id)
    return { payout_account: null }
  }
}
