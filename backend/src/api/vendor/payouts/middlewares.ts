import { validateAndTransformQuery, authenticate } from '@medusajs/framework'
import { MiddlewareRoute } from '@medusajs/medusa'

import { vendorPayoutQueryConfig } from './query-config'
import { VendorGetPayoutParams } from './validators'

export const vendorPayoutMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/vendor/payouts',
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformQuery(
        VendorGetPayoutParams,
        vendorPayoutQueryConfig.list
      )
    ]
  }
]
