import { 
  AuthenticatedMedusaRequest, 
  MedusaResponse
} from "@medusajs/framework"
import { 
  ContainerRegistrationKeys
} from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Ensure the customer is authenticated
  const customerId = req.auth_context.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // Fetch customer's digital product orders
  const { data: [customer] = [] } = await query.graph({
    entity: "customer",
    fields: [
      "orders.digital_product_order.products.*",
      "orders.digital_product_order.products.medias.*",
    ],
    filters: {
      id: customerId,
    },
  })

  if (!customer) {
    return res.json({ digital_products: [] })
  }

  // Extract unique digital products
  const digitalProducts = {}

  customer.orders?.forEach((order) => {
    order.digital_product_order?.products?.forEach((product) => {
      digitalProducts[product.id] = product
    })
  })

  res.json({
    digital_products: Object.values(digitalProducts),
  })
}
