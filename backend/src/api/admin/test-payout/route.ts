import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { processPayoutForOrderWorkflow } from '../../../workflows/order/workflows'

/**
 * @oas [post] /admin/test-payout
 * operationId: "AdminTestPayout"
 * summary: "Test Payout for Order"
 * description: "Manually trigger payout for a specific order (for testing purposes)"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           order_id:
 *             type: string
 *             description: The order ID to process payout for
 *         required:
 *           - order_id
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             message:
 *               type: string
 *             payout:
 *               type: object
 * tags:
 *   - Admin
 * security:
 *   - api_token: []
 */
export const POST = async (
  req: MedusaRequest<{ order_id: string }>,
  res: MedusaResponse
) => {
  console.log('🧪 [TEST PAYOUT] Manual payout trigger for order:', req.body.order_id)

  try {
    const { order_id } = req.body

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      })
    }

    // First, let's debug the order and customer setup
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    
    console.log('🔍 [DEBUG] Querying order details...')
    const {
      data: [order]
    } = await query.graph({
      entity: 'order',
      fields: ['*', 'customer.*', 'items.product_id'],
      filters: {
        id: order_id
      }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    console.log('🔍 [DEBUG] Order:', order)

    console.log('🔍 [DEBUG] Order details:', {
      id: order.id,
      customer_id: order.customer?.id,
      customer_email: order.customer?.email,
      total: order.total,
      currency_code: order.currency_code,
      product_ids: order.items?.map(item => item.product_id),
      metadata: order.metadata
    })

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order has no items'
      })
    }

    // Get the vendor (creator) from the first product in the order
    console.log('🔍 [DEBUG] Getting vendor from product...')
    const {
      data: [product]
    } = await query.graph({
      entity: 'product',
      fields: ['customer.*'],
      filters: {
        id: order.items[0].product_id
      }
    })

    if (!product || !product.customer) {
      return res.status(400).json({
        success: false,
        message: 'No vendor found for this product',
        debug: {
          order_id: order.id,
          product_id: order.items[0].product_id
        }
      })
    }

    const vendor = product.customer
    console.log('🔍 [DEBUG] Vendor details:', {
      vendor_id: vendor.id,
      vendor_email: vendor.email
    })

    // Check if vendor has payout account
    console.log('🔍 [DEBUG] Checking vendor payout account...')
    const {
      data: [payoutAccountRelation]
    } = await query.graph({
      entity: 'customer_payout_account',
      fields: ['*'],
      filters: {
        customer_id: vendor.id
      }
    })

    console.log('🔍 [DEBUG] Payout account relation:', payoutAccountRelation)

    if (!payoutAccountRelation) {
      return res.status(400).json({
        success: false,
        message: 'Vendor has no payout account. Please set up Stripe Connect first.',
        debug: {
          order_id: order.id,
          vendor_id: vendor.id,
          vendor_email: vendor.email
        }
      })
    }

    // Check payout account status
    const {
      data: [payoutAccount]
    } = await query.graph({
      entity: 'payout_account',
      fields: ['*'],
      filters: {
        id: payoutAccountRelation.payout_account_id
      }
    })

    console.log('🔍 [DEBUG] Payout account details:', payoutAccount)

    if (!payoutAccount) {
      return res.status(400).json({
        success: false,
        message: 'Payout account not found'
      })
    }

    if (payoutAccount.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Vendor payout account is not active',
        debug: {
          payout_account_id: payoutAccount.id,
          status: payoutAccount.status,
          vendor_id: vendor.id,
          vendor_email: vendor.email
        }
      })
    }

    // Run the payout workflow manually
    console.log('🚀 [TEST PAYOUT] Running payout workflow...')
    const { result, errors } = await processPayoutForOrderWorkflow(req.scope).run({
      input: {
        order_id: order_id
      },
      context: {
        transactionId: order_id
      }
    })

    if (errors && errors.length > 0) {
      console.log('❌ [TEST PAYOUT] Workflow errors:', errors)
      return res.status(400).json({
        success: false,
        message: 'Payout workflow failed',
        errors: errors
      })
    }

    console.log('✅ [TEST PAYOUT] Payout workflow completed successfully')
    console.log('🔍 [DEBUG] Workflow result:', result)
    
    // Type the result properly
    const payoutResult = result as {
      payout_id: string
      order_id: string
      vendor_id: string
      vendor_email: string
      amount: number
      currency_code: string
      status: string
      stripe_transfer_id: string
      created_at: Date
      error: boolean
    }

    // Get additional payout details for better response
    const {
      data: [payoutRecord]
    } = await query.graph({
      entity: 'payout',
      fields: ['*'],
      filters: {
        id: payoutResult.payout_id
      }
    })

    // Calculate commission breakdown
    const orderTotal = order.metadata?.amount || order.total || 0
    const platformCommissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.3')
    const platformCommission = orderTotal * platformCommissionRate
    const vendorAmount = orderTotal - platformCommission

    return res.json({
      success: true,
      message: 'Payout processed successfully',
      payout: {
        payout_id: payoutResult.payout_id,
        order_id: payoutResult.order_id,
        vendor: {
          id: payoutResult.vendor_id,
          email: payoutResult.vendor_email
        },
        amount: {
          total: orderTotal,
          vendor_amount: vendorAmount,
          platform_commission: platformCommission,
          currency: payoutResult.currency_code
        },
        status: payoutResult.status,
        stripe_transfer_id: payoutResult.stripe_transfer_id,
        created_at: payoutResult.created_at,
        error: payoutResult.error
      },
      breakdown: {
        order_total: orderTotal,
        platform_commission_rate: `${(platformCommissionRate * 100)}%`,
        platform_commission: platformCommission,
        vendor_amount: vendorAmount,
        currency: payoutResult.currency_code
      },
      debug: {
        order_metadata: order.metadata,
        payout_account_id: payoutAccount.id,
        stripe_account_id: payoutAccount.reference_id
      }
    })

  } catch (error: any) {
    console.log('❌ [TEST PAYOUT] Error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      stack: error.stack
    })
  }
}
