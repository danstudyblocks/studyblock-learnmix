import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import { fetchCustomerByAuthActorId } from '@/shared/http/utils'
import {
  createPayoutAccountForCustomerWorkflow
} from '../../../workflows/customer/workflows'
import { refetchPayoutAccount } from './utils'
import { VendorCreatePayoutAccountType } from './validators'
import { PAYOUT_MODULE } from '../../../modules/payout'

/**
 * @oas [get] /vendor/payout-account
 * operationId: "VendorGetPayoutAccount"
 * summary: "Get Payout Account"
 * description: "Retrieves the payout account for the authenticated vendor."
 * x-authenticated: true
 * parameters:
 *   - in: query
 *     name: fields
 *     schema:
 *       type: string
 *     description: Comma-separated fields that should be included in the returned data.
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             payout_account:
 *               $ref: "#/components/schemas/VendorPayoutAccount"
 * tags:
 *   - Payment Account
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  console.log('🔍 GET /vendor/payout-account - Debug Info:')
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
  
  // Default fields if queryConfig is not available
  const fields = req.queryConfig?.fields || ['id', 'status', 'reference_id', 'data', 'created_at', 'updated_at']
  
  const result = await refetchPayoutAccount(
    req.scope,
    fields.map((field) => `payout_account.${field}`),
    { customer_id: customerId }
  )

  console.log('🔍 [DEBUG] Raw result from refetchPayoutAccount:', JSON.stringify(result, null, 2))

  let payout_account = result.payout_account || result

  console.log('🔍 [DEBUG] Extracted payout_account:', JSON.stringify(payout_account, null, 2))

  if (!payout_account) {
    // No payout account exists yet
    return res.status(404).json({
      message: 'No payout account found. Please create one first.',
      payout_account: null
    })
  }

  // If payout_account is nested, extract the actual payout account data
  if (payout_account.payout_account) {
    payout_account = payout_account.payout_account
  }

  console.log('🔍 [DEBUG] Final payout_account after extraction:', JSON.stringify(payout_account, null, 2))

  if (payout_account.status !== 'active') {
    console.log('🔄 [SYNC] Payout account is not active, syncing with Stripe...')
    console.log('🔄 [SYNC] Payout account details:', {
      id: payout_account.id,
      status: payout_account.status,
      reference_id: payout_account.reference_id
    })
    
    // Sync with Stripe to get latest status
    try {
      const payoutService = req.scope.resolve(PAYOUT_MODULE) as any
      await payoutService.syncStripeAccount(payout_account.id)
      console.log('✅ [SYNC] Successfully synced with Stripe')
    } catch (error) {
      console.log('⚠️ [SYNC] Failed to sync with Stripe:', error.message)
    }

    const refreshed = await refetchPayoutAccount(
      req.scope,
      fields.map((field) => `payout_account.${field}`),
      { customer_id: customerId }
    )

    payout_account = refreshed.payout_account
    console.log('🔄 [SYNC] Refreshed payout account status:', payout_account?.status)
  }

  res.json({
    payout_account: payout_account
  })
}

/**
 * @oas [post] /vendor/payout-account
 * operationId: "VendorCreatePayoutAccount"
 * summary: "Create Payout Account"
 * description: "Creates a payout account for the authenticated vendor."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/VendorCreatePayoutAccount"
 * responses:
 *   "201":
 *     description: Created
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             payout_account:
 *               $ref: "#/components/schemas/VendorPayoutAccount"
 * tags:
 *   - Payment Account
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<VendorCreatePayoutAccountType>,
  res: MedusaResponse
) => {
  console.log('🔍 POST /vendor/payout-account - Debug Info:')
  console.log('  - req.auth_context:', req.auth_context)
  console.log('  - req.headers.authorization:', req.headers.authorization)
  console.log('  - req.cookies:', req.cookies)
  console.log('  - req.session:', req.session)
  console.log('  - req.body:', req.body)

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
  const customer = await fetchCustomerByAuthActorId(
    customerId,
    req.scope
  )
  console.log('✅ Customer fetched:', customer?.id)

  const { result } = await createPayoutAccountForCustomerWorkflow(req.scope).run({
    input: {
      customer_id: customer.id,
      context: req.validatedBody?.context ?? req.body?.context ?? {}
    }
  })

  // Default fields if queryConfig is not available
  const fields = req.queryConfig?.fields || ['id', 'status', 'reference_id', 'data', 'created_at', 'updated_at']
  
  const {
    data: [payoutAccount]
  } = await query.graph(
    {
      entity: 'payout_account',
      fields: fields,
      filters: {
        id: (result as any).id
      }
    },
    { throwIfKeyNotFound: true }
  )

  res.status(201).json({
    payout_account: payoutAccount
  })
}
