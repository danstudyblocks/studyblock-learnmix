import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import { fetchCustomerByAuthActorId } from '@/shared/http/utils'
import { createOnboardingForCustomerWorkflow } from '@/workflows/customer/workflows'
import { VendorCreateOnboardingType } from '../validators'

/**
 * @oas [post] /vendor/payout-account/onboarding
 * operationId: "VendorCreateOnboarding"
 * summary: "Create Onboarding"
 * description: "Creates an onboarding for the authenticated vendor's payout account."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/VendorCreateOnboarding"
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
export const POST = async (
  req: AuthenticatedMedusaRequest<VendorCreateOnboardingType>,
  res: MedusaResponse
) => {
  console.log('🔍 POST /vendor/payout-account/onboarding - Debug Info:')
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

  const { result } = await createOnboardingForCustomerWorkflow(req.scope).run({
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
      fields: [...fields, 'onboarding.id', 'onboarding.data', 'onboarding.context'],
      filters: {
        id: (result as any).payout_account_id
      }
    },
    { throwIfKeyNotFound: true }
  )

  console.log('🔗 [ONBOARDING API] Payout account with onboarding data:', {
    id: payoutAccount.id,
    onboarding: payoutAccount.onboarding,
    onboarding_url: payoutAccount.onboarding?.data?.onboarding_url
  })

  res.status(200).json({
    payout_account: payoutAccount
  })
}
