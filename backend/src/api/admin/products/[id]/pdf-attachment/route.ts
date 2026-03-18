import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import DigitalProductModuleService from "@/modules/digital-product/service"
import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const fileModuleService = req.scope.resolve(Modules.FILE)
  const digitalProductModuleService: DigitalProductModuleService = 
    req.scope.resolve(DIGITAL_PRODUCT_MODULE)

  try {
    const attachments = await digitalProductModuleService.listProductPdfAttachments({
      product_id: productId
    })

    if (!attachments.length) {
      return res.json({ attachment: null })
    }

    const attachment = attachments[0]
    const fileData = await fileModuleService.retrieveFile(attachment.file_id)

    res.json({
      attachment: {
        id: attachment.id,
        file_id: attachment.file_id,
        filename: attachment.filename,
        url: fileData.url
      }
    })
  } catch (error) {
    console.error("Error fetching PDF attachment:", error)
    res.status(500).json({
      error: `Failed to fetch PDF attachment: ${error.message}`
    })
  }
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const file = req.file as Express.Multer.File

  if (!file) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No file was uploaded"
    )
  }

  if (file.mimetype !== "application/pdf") {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Only PDF files are allowed"
    )
  }

  const digitalProductModuleService: DigitalProductModuleService = 
    req.scope.resolve(DIGITAL_PRODUCT_MODULE)

  try {
    // Delete existing attachment if any
    const existingAttachments = await digitalProductModuleService.listProductPdfAttachments({
      product_id: productId
    })

    if (existingAttachments.length > 0) {
      await digitalProductModuleService.deleteProductPdfAttachments(
        existingAttachments.map(a => a.id)
      )
    }

    // Upload new file
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: [{
          filename: file.originalname,
          mimeType: file.mimetype,
          content: file.buffer.toString("binary"),
          access: "private",
        }],
      },
    })

    const uploadedFile = result[0]

    // Create attachment record
    const [attachment] = await digitalProductModuleService.createProductPdfAttachments([{
      product_id: productId,
      file_id: uploadedFile.id,
      filename: file.originalname,
      mime_type: file.mimetype
    }])

    const fileModuleService = req.scope.resolve(Modules.FILE)
    const fileData = await fileModuleService.retrieveFile(attachment.file_id)

    res.json({
      attachment: {
        id: attachment.id,
        file_id: attachment.file_id,
        filename: attachment.filename,
        url: fileData.url
      }
    })
  } catch (error) {
    console.error("Error uploading PDF attachment:", error)
    res.status(500).json({
      error: `Failed to upload PDF attachment: ${error.message}`
    })
  }
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id: productId } = req.params
  const digitalProductModuleService: DigitalProductModuleService = 
    req.scope.resolve(DIGITAL_PRODUCT_MODULE)

  try {
    const attachments = await digitalProductModuleService.listProductPdfAttachments({
      product_id: productId
    })

    if (attachments.length > 0) {
      await digitalProductModuleService.deleteProductPdfAttachments(
        attachments.map(a => a.id)
      )
    }

    res.json({ message: "PDF attachment deleted successfully" })
  } catch (error) {
    console.error("Error deleting PDF attachment:", error)
    res.status(500).json({
      error: `Failed to delete PDF attachment: ${error.message}`
    })
  }
}
