import { Modules } from '@medusajs/framework/utils'
import { transform, when, WorkflowResponse } from '@medusajs/framework/workflows-sdk'
import {
  createRemoteLinkStep,
  emitEventStep,
  useQueryGraphStep
} from '@medusajs/medusa/core-flows'
import { createWorkflow } from '@medusajs/framework/workflows-sdk'

import { PAYOUT_MODULE } from '../../../modules/payout'
import { PayoutWorkflowEvents } from '../../../modules/payout/types'
import {
  calculatePayoutForOrderStep,
  createPayoutStep,
  validateNoExistingPayoutForOrderStep,
  validateCustomerPayoutAccountStep
} from '../steps'

type ProcessPayoutForOrderWorkflowInput = {
  order_id: string
}

export const processPayoutForOrderWorkflow = createWorkflow(
  { name: 'process-payout-for-order' },
  function (input: ProcessPayoutForOrderWorkflowInput) {
    validateNoExistingPayoutForOrderStep(input.order_id)

    const { data: orders } = useQueryGraphStep({
      entity: 'order',
      fields: [
        'customer.id',
        'total',
        'currency_code',
        'metadata',
        'payment_collections.payment_sessions.*',
        'items.product_id',
        'split_order_payment.*'
      ],
      filters: {
        id: input.order_id
      },
      options: { throwIfKeyNotFound: true }
    }).config({ name: 'query-order' })

    const order = transform(orders, (orders) => {
      const transformed = orders[0]

      return {
        customer_id: transformed.customer.id,
        id: transformed.id,
        total: transformed.total,
        currency_code: transformed.currency_code,
        metadata: transformed.metadata,
        source_transaction:
          transformed.payment_collections[0].payment_sessions[0].data
            .latest_charge,
        product_ids: transformed.items.map(item => item.product_id)
      }
    })

    // Get the vendor (creator) from the first product in the order
    const { data: products } = useQueryGraphStep({
      entity: 'product',
      fields: ['customer.*'],
      filters: {
        id: order.product_ids[0] // Get vendor from first product
      }
    }).config({ name: 'query-product-vendor' })

    const vendor = transform(products, (products) => {
      if (!products || products.length === 0 || !products[0].customer) {
        throw new Error('No vendor found for this product')
      }
      return products[0].customer
    })

    const customerWithPayoutAccount = validateCustomerPayoutAccountStep(vendor)

    const payout_total = calculatePayoutForOrderStep(input)

    const { payout, err: createPayoutErr } = createPayoutStep({
      transaction_id: order.id,
      amount: payout_total,
      currency_code: order.currency_code,
      account_id: transform(customerWithPayoutAccount, (customer: any) => customer.payout_account.id),
      source_transaction: order.source_transaction || undefined
    })

    when({ createPayoutErr }, ({ createPayoutErr }) => !createPayoutErr).then(
      () => {
        createRemoteLinkStep([
          {
            [Modules.ORDER]: {
              order_id: order.id
            },
            [PAYOUT_MODULE]: {
              payout_id: payout!.id
            }
          }
        ])

        emitEventStep({
          eventName: PayoutWorkflowEvents.SUCCEEDED,
          data: {
            id: payout!.id,
            order_id: order.id
          }
        }).config({ name: 'emit-payout-succeeded' })
      }
    )

    when({ createPayoutErr }, ({ createPayoutErr }) => createPayoutErr).then(
      () => {
        emitEventStep({
          eventName: PayoutWorkflowEvents.FAILED,
          data: {
            order_id: order.id
          }
        }).config({ name: 'emit-payout-failed' })
      }
    )

    // Store the result for the test endpoint to access
    const result = transform({ payout, payout_total, order, customerWithPayoutAccount }, ({ payout, payout_total, order, customerWithPayoutAccount }: any) => ({
      payout_id: payout?.id || '',
      order_id: order.id,
      vendor_id: customerWithPayoutAccount.id,
      vendor_email: customerWithPayoutAccount.email,
      amount: payout_total,
      currency_code: order.currency_code,
      status: 'pending',
      stripe_transfer_id: payout?.data?.id || '',
      created_at: payout?.created_at || new Date(),
      error: createPayoutErr || false
    }))

    return new WorkflowResponse(result)
  }
)
