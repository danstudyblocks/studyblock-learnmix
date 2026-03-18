import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Resolve the query object from the Medusa container
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // First, fetch the customer using the provided product ID
  const { data: [product] } = await query.graph({
    entity: "product",
    fields: ["customer.*"],  // Fetch all properties of the customer linked to the product
    filters: {
      id: req.params.id,  // Filter by product ID
    },
  })

  // Check if a customer is linked to the product
  if (!product || !product.customer) {
    return res.status(404).json({ message: "Customer not found for this product" })
  }

  // Fetch all payout details using the customer ID as the creator_id
  const { data: [payout] } = await query.graph({
    entity: "payout",
    fields: ["*"],  // Fetch all fields from the payout entity
    filters: {
      creator_id: product.customer.id,  // Use the customer ID as the creator ID
    },
  })

  console.log( "payout", payout)
  // Return the payout details if found, or an error if not found
  if (payout) {
    return res.json({ payout })  // Return the payout details
  } else {
    return res.status(404).json({ message: "Payment details not found for this customer" })
  }
}
