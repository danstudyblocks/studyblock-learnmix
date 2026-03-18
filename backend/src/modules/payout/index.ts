import { Module } from '@medusajs/framework/utils'

import PayoutModuleService from './service'
import { Payout, PayoutAccount } from './models'

export const PAYOUT_MODULE = 'payout'

export default Module(PAYOUT_MODULE, {
  service: PayoutModuleService
})
