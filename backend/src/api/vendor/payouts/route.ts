import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import {
  ContainerRegistrationKeys,
  MedusaError
} from '@medusajs/framework/utils'

import sellerPayoutAccount from '@/links/customer-payout-account'

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  console.log('🔍 GET /vendor/payouts - Debug Info:')
  console.log('  - req.auth_context:', req.auth_context)
  console.log('  - req.headers.authorization:', req.headers.authorization)
  console.log('  - req.cookies:', req.cookies)
  console.log('  - req.session:', req.session)

  // Manual JWT token parsing as fallback
  let customerId = req.auth_context?.actor_id
  
  if (!customerId && req.headers.authorization) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '')
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      customerId = payload.actor_id
      console.log('✅ JWT token parsed manually - customerId:', customerId)
    } catch (error) {
      console.log('❌ Failed to parse JWT token:', error)
    }
  }

  // Check if user is authenticated
  if (!customerId) {
    console.log('❌ Authentication failed - no actor_id')
    return res.status(401).json({ message: 'Unauthorized' })
  }

  console.log('✅ Authentication successful - customerId:', customerId)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  console.log('✅ Using customerId:', customerId)

  let sellerPayoutAccountRelation
  
  try {
    const {
      data: [relation]
    } = await query.graph({
      entity: sellerPayoutAccount.entryPoint,
      fields: ['payout_account_id'],
      filters: { customer_id: customerId }
    })

    sellerPayoutAccountRelation = relation
  } catch (error) {
    console.log('ℹ️ No payout account relation found for customer:', customerId)
    return res.status(404).json({
      message: 'No payout account found. Please create one first.',
      payouts: [],
      count: 0,
      offset: 0,
      limit: 20
    })
  }

  if (!sellerPayoutAccountRelation) {
    return res.status(404).json({
      message: 'No payout account found. Please create one first.',
      payouts: [],
      count: 0,
      offset: 0,
      limit: 20
    })
  }

  // Default fields and pagination if queryConfig is not available
  const fields = req.queryConfig?.fields || ['id', 'amount', 'currency_code', 'status', 'created_at', 'updated_at']
  const pagination = req.queryConfig?.pagination || { skip: 0, take: 20 }
  
  const { data: payouts, metadata } = await query.graph({
    entity: 'payout',
    fields: fields,
    filters: {
      payout_account_id: sellerPayoutAccountRelation.payout_account_id
    },
    pagination: pagination
  })

  res.json({
    payouts,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take
  })
}
