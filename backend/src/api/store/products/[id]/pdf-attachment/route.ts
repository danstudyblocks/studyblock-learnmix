import { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework"
import { 
  Modules,
  MedusaError,
} from "@medusajs/framework/utils"
import DigitalProductModuleService from "@/modules/digital-product/service"
import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product"

/**
 * GET /store/products/:id/pdf-attachment
 * Returns PDF attachment info for a product (if exists)
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const fileModuleService = req.scope.resolve(Modules.FILE)
  const digitalProductModuleService: DigitalProductModuleService = 
    req.scope.resolve(DIGITAL_PRODUCT_MODULE)

  try {
    // Get PDF attachment
    const attachments = await digitalProductModuleService.listProductPdfAttachments({
      product_id: productId
    })

    if (!attachments.length) {
      return res.status(404).json({
        error: "No PDF attachment found for this product",
        has_pdf: false
      })
    }

    const attachment = attachments[0]
    const fileData = await fileModuleService.retrieveFile(attachment.file_id)

    res.json({
      has_pdf: true,
      url: fileData.url,
      filename: attachment.filename,
      mime_type: attachment.mime_type
    })
  } catch (error) {
    console.error("Error fetching PDF attachment:", error)
    
    res.status(500).json({
      error: `Failed to fetch PDF attachment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      has_pdf: false
    })
  }
}
