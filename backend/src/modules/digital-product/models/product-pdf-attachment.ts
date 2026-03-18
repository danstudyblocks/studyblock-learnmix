import { model } from "@medusajs/framework/utils"

const ProductPdfAttachment = model.define("product_pdf_attachment", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  file_id: model.text(),
  filename: model.text(),
  mime_type: model.text().default("application/pdf")
})

export default ProductPdfAttachment
