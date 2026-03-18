import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError } from "@medusajs/framework/utils"

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  try {
    const files = req.files as Express.Multer.File[]
    
    if (!files?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No files were uploaded"
      )
    }
    
    // Filter only SVG and WebP files
    const allowedFiles = files.filter(file => 
      file.mimetype === "image/svg+xml" || 
      file.mimetype === "image/webp" ||
      file.originalname.toLowerCase().endsWith('.svg') ||
      file.originalname.toLowerCase().endsWith('.webp')
    )
    
    if (!allowedFiles.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Only SVG and WebP files are allowed"
      )
    }
    
    // Upload files to storage
    const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: allowedFiles.map((file) => ({
          filename: file.originalname,
          mimeType: file.mimetype,
          content: file.buffer,
          access: "public", // Assets are publicly accessible
        })),
      },
    })
    
    res.status(200).json({ files: uploadedFiles })
  } catch (error) {
    console.error("Error uploading SVG files:", error)
    res.status(500).json({ error: error.message })
  }
}
