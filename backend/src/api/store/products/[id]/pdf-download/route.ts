import { 
  AuthenticatedMedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework"
import { 
  Modules,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import DigitalProductModuleService from "@/modules/digital-product/service"
import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const fileModuleService = req.scope.resolve(Modules.FILE)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const digitalProductModuleService: DigitalProductModuleService = 
    req.scope.resolve(DIGITAL_PRODUCT_MODULE)

  try {
    // Verify customer has purchased this product
    const { data: [customer] } = await query.graph({
      entity: "customer",
      fields: [
        "orders.items.product_id",
        "orders.payment_status",
      ],
      filters: {
        id: req.auth_context.actor_id,
      },
    })

    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Customer not found"
      )
    }

    // Check if customer has purchased this product
    const hasPurchased = customer.orders.some((order) => 
      order.payment_status === "captured" &&
      order.items.some((item) => item.product_id === productId)
    )

    if (!hasPurchased) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You must purchase this product to download the attachment"
      )
    }

    // Get PDF attachment
    const attachments = await digitalProductModuleService.listProductPdfAttachments({
      product_id: productId
    })

    if (!attachments.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "No PDF attachment found for this product"
      )
    }

    const attachment = attachments[0]
    const fileData = await fileModuleService.retrieveFile(attachment.file_id)

    res.json({
      url: fileData.url,
      filename: attachment.filename
    })
  } catch (error) {
    console.error("Error downloading PDF:", error)
    
    if (error instanceof MedusaError) {
      res.status(error.type === MedusaError.Types.NOT_ALLOWED ? 403 : 404).json({
        error: error.message
      })
    } else {
      res.status(500).json({
        error: `Failed to download PDF: ${error.message}`
      })
    }
  }
}
