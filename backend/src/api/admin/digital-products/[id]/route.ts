import DigitalProductModuleService from "@/modules/digital-product/service"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils"

// Define a partial interface for the update data based on your digital product structure
interface DigitalProductUpdateData {
    [key: string]: any; // Flexible for any fields, adjust to specific fields if known
}

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { id } = req.params
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
        const { data: [digitalProduct] } = await query.graph({
            entity: "digital_product",
            fields: [
                "*",
                "medias.*",
                "product_variant.*",
            ],
            filters: { id },
        })
        if (!digitalProduct) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Digital product with ID ${id} not found`
            )
        }
        res.json({ digital_product: digitalProduct })
    } catch (error) {
        console.error("Error fetching digital product:", error)
        res.status(500).json({
            error: `Failed to fetch digital product: ${error.message}`
        })
    }
}

export const PUT = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { id } = req.params
        const updateData: DigitalProductUpdateData = req.body

        if (!id) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Digital product ID is required"
            )
        }

        // Optional: Validate updateData is an object
        if (typeof updateData !== "object" || updateData === null) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Update data must be an object"
            )
        }

        const digitalProductModuleService = req.scope.resolve("digitalProductModuleService") as DigitalProductModuleService

        // Update the digital product using the module service
        const updatedDigitalProduct = await digitalProductModuleService.updateDigitalProducts([{
            id,
            ...updateData
        }])

        res.json({ digital_product: updatedDigitalProduct[0] })
    } catch (error) {
        console.error("Error updating digital product:", error)
        res.status(500).json({
            error: `Failed to update digital product: ${error.message}`
        })
    }
}

export const DELETE = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    try {
        const { id } = req.params
        console.log("Deleting digital product with ID:", id)
        if (!id) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "Template ID is required"
            )
        }

        const digitalProductModuleService = req.scope.resolve("digitalProductModuleService") as DigitalProductModuleService

        // Delete the digital product using the module service
        await digitalProductModuleService.deleteDigitalProducts([id])

        res.json({ message: "Digital product deleted successfully" })
    } catch (error) {
        console.error("Error deleting digital product:", error)
        res.status(500).json({
            error: `Failed to delete digital product: ${error.message}`
        })
    }
}