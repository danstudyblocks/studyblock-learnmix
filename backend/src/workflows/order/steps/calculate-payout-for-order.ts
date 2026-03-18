import { ContainerRegistrationKeys, MathBN } from '@medusajs/framework/utils'
import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { SplitOrderPaymentDTO } from '../../../modules/split-order-payment/types'

export const calculatePayoutForOrderStep = createStep(
  'calculate-payout-for-order',
  async (
    input: {
      order_id: string
    },
    { container }
  ) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const {
      data: [order]
    } = await query.graph({
      entity: 'order',
      fields: ['total', 'metadata', 'split_order_payment.*'],
      filters: {
        id: input.order_id
      }
    })

    // Check if split_order_payment exists, otherwise use order total or metadata
    let total_amount
    if (order.split_order_payment) {
      const orderPayment: SplitOrderPaymentDTO = order.split_order_payment
      const captured_amount = MathBN.convert(orderPayment.captured_amount)
      const refunded_amount = MathBN.convert(orderPayment.refunded_amount)
      total_amount = captured_amount.minus(refunded_amount)
    } else {
      // Fallback to order total or metadata amount
      const orderTotal = order.total || order.metadata?.amount || 0
      total_amount = MathBN.convert(orderTotal)
    }
    
    // Calculate commission using the same logic as order-placed subscriber
    const platformCommissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.3')
    const platform_commission = total_amount.multipliedBy(platformCommissionRate)
    
    // Vendor gets the remaining amount after platform commission
    const payout_total = total_amount.minus(platform_commission)

    return new StepResponse(payout_total)
  }
)
