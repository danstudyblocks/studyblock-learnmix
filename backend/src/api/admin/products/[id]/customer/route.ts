import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [product] } = await query.graph({
    entity: "product",
    fields: ["customer.*"],  // Fetch all properties of the customer linked to the product
    filters: {
      id: req.params.id,  // Filter by product ID
    },
  })

  if (!product) {
    return res.status(404).json({ message: "Product not found" })
  }

  if (product.customer) {
    res.json({ customer: product.customer })  // Return the customer if found
  } else {
    // Return empty customer object instead of 404 so the widget can handle it properly
    res.json({ customer: null })
  }
}
