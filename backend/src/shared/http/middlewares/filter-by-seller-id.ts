import { NextFunction } from 'express'

import { AuthenticatedMedusaRequest } from '@medusajs/framework/http'

import { fetchCustomerByAuthActorId } from '../utils/seller'

/**
 * @desc Adds a customer id to the filterable fields
 */
export function filterBySellerId() {
  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const customer = await fetchCustomerByAuthActorId(
      req.auth_context.actor_id,
      req.scope
    )

    req.filterableFields.customer_id = customer.id

    return next()
  }
}
