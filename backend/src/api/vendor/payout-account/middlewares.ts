import {
  validateAndTransformBody,
  validateAndTransformQuery,
  authenticate
} from '@medusajs/framework'
import { MiddlewareRoute } from '@medusajs/medusa'

import { vendorPayoutAccountQueryConfig } from './query-config'
import {
  VendorCreateOnboarding,
  VendorCreatePayoutAccount,
  VendorGetPayoutAccountParams
} from './validators'

export const vendorPayoutAccountMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/vendor/payout-account',
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformQuery(
        VendorGetPayoutAccountParams,
        vendorPayoutAccountQueryConfig.retrieve
      )
    ]
  },
  {
    method: ['POST'],
    matcher: '/vendor/payout-account',
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformBody(VendorCreatePayoutAccount as any),
      validateAndTransformQuery(
        VendorGetPayoutAccountParams,
        vendorPayoutAccountQueryConfig.retrieve
      )
    ]
  },
  {
    method: ['POST'],
    matcher: '/vendor/payout-account/onboarding',
    middlewares: [
      authenticate("customer", ["session", "bearer"]),
      validateAndTransformBody(VendorCreateOnboarding as any),
      validateAndTransformQuery(
        VendorGetPayoutAccountParams,
        vendorPayoutAccountQueryConfig.retrieve
      )
    ]
  }
]
