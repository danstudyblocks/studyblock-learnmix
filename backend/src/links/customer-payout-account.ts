import { defineLink } from '@medusajs/framework/utils'
import CustomerModule from "@medusajs/medusa/customer"
import PayoutModule from '../modules/payout'

export default defineLink(
  CustomerModule.linkable.customer,
  {
    linkable: PayoutModule.linkable.payoutAccount,
    isList: true
  }
)
