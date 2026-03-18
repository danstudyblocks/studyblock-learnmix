import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

        const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "customer.*"],  // Fetch product fields and all customer properties
            filters: {
                id: req.params.id,  // Filter by product ID
            },
        })

        const product = products?.[0]

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (product.customer) {
            return res.json({ customer: product.customer })  // Return the customer if found
        } else {
            return res.status(404).json({ message: "Customer not found for this product" })
        }
    } catch (error) {
        console.error("Error fetching product creator:", error)
        return res.status(500).json({ 
            message: "Internal server error", 
            error: error instanceof Error ? error.message : "Unknown error" 
        })
    }
}
