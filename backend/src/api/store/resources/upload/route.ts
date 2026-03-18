import { MedusaRequest, MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  try {
    const { title, description, file_url, customer_id } = req.body

    console.log('Upload request received:', { title, description, customer_id })

    if (!title || !customer_id) {
      return res.status(400).json({
        success: false,
        error: "Title and customer_id are required"
      })
    }

    // Use createProductsWorkflow to properly create product with options and variants
    const { createProductsWorkflow } = await import("@medusajs/medusa/core-flows")
    
    // Get default sales channel
    const salesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL)
    const salesChannels = await salesChannelModuleService.listSalesChannels()
    const defaultSalesChannel = salesChannels.find((sc: any) => sc.is_default) || salesChannels[0]

    // Create product with required options and variants
    const { result } = await createProductsWorkflow(req.scope).run({
      input: {
        products: [{
          title,
          description: description || "",
          status: "published",
          thumbnail: file_url || "",
          options: [
            {
              title: "Default",
              values: ["Standard"]
            }
          ],
          variants: [
            {
              title: "Standard",
              options: {
                Default: "Standard"
              },
              manage_inventory: false,
              prices: [
                {
                  amount: 0,
                  currency_code: "usd"
                }
              ]
            }
          ],
          sales_channels: defaultSalesChannel ? [defaultSalesChannel] : salesChannels,
          metadata: {
            uploaded_by: customer_id,
            creator_id: customer_id,
            is_user_upload: true,
            upload_date: new Date().toISOString(),
            file_url: file_url || "",
          }
        }]
      }
    })

    const product = result[0]

    console.log('Product created:', product.id)

    // Link product to customer using remoteLink
    try {
      const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      await remoteLink.create({
        [Modules.PRODUCT]: {
          product_id: product.id,
        },
        [Modules.CUSTOMER]: {
          customer_id: customer_id,
        },
      })
      console.log('Product linked to customer successfully')
    } catch (linkError) {
      console.error('Error linking product to customer:', linkError)
      // Continue anyway - product is created with metadata
    }

    return res.status(201).json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
      },
      message: "Resource uploaded successfully! Our team will review and publish it."
    })
  } catch (error) {
    console.error("Error uploading resource:", error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload resource"
    })
  }
}
