import {
  BigNumber,
  ContainerRegistrationKeys,
  MathBN
} from '@medusajs/framework/utils'
import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

export const calculateTotalCommissionStep = createStep(
  'calculate-total-commission',
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
      fields: ['total', 'split_order_payment.*'],
      filters: {
        id: input.order_id
      }
    })

    // Check if split_order_payment exists, otherwise use order total
    let total_amount
    if (order.split_order_payment) {
      const orderPayment = order.split_order_payment
      const captured_amount = MathBN.convert(orderPayment.captured_amount)
      const refunded_amount = MathBN.convert(orderPayment.refunded_amount)
      total_amount = captured_amount.minus(refunded_amount)
    } else {
      // Fallback to order total if split_order_payment doesn't exist
      total_amount = MathBN.convert(order.total || 0)
    }
    
    // Calculate commission using the same logic as order-placed subscriber
    const platformCommissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.3')
    const total_commission = total_amount.multipliedBy(platformCommissionRate)

    return new StepResponse({ total_commission })
  }
)
