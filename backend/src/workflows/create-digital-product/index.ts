import { 
  createWorkflow,
  transform,
  when,
  WorkflowResponse
} from "@medusajs/framework/workflows-sdk"
import {
  CreateProductWorkflowInputDTO
} from "@medusajs/framework/types"
import { 
  createProductsWorkflow,
  createRemoteLinkStep
} from "@medusajs/medusa/core-flows"
import { 
  Modules
} from "@medusajs/framework/utils"
import createDigitalProductStep, { 
  CreateDigitalProductStepInput
} from "./steps/create-digital-product"
import createDigitalProductMediasStep, { 
  CreateDigitalProductMediaInput
} from "./steps/create-digital-product-medias"
import { DIGITAL_PRODUCT_MODULE } from "../../modules/digital-product"
import linkCustomerToProductStep from "./steps/link-customer-to-product"

type CreateDigitalProductWorkflowInput = {
  digital_product: CreateDigitalProductStepInput & {
    medias: Omit<CreateDigitalProductMediaInput, "digital_product_id">[]
  }
  product?: CreateProductWorkflowInputDTO // Optional - can link to existing product
  product_id?: string // If linking to existing product
  variant_id?: string // If linking to specific variant (for downloadable PDFs)
}

const createDigitalProductWorkflow = createWorkflow(
  "create-digital-product",
  (input: CreateDigitalProductWorkflowInput) => {
    const { medias, ...digitalProductData } = input.digital_product

    // Create product only if not linking to existing one
    const productResult = input.product 
      ? createProductsWorkflow.runAsStep({
          input: {
            products: [input.product]
          }
        })
      : null

    // Extract product ID from result using transform
    const createdProductId = transform(
      { productResult },
      (data) => {
        if (!data.productResult) return null
        // createProductsWorkflow returns an array of products
        const products = data.productResult
        return products && products.length > 0 && products[0]?.id ? products[0].id : null
      }
    )

    const { digital_product } = createDigitalProductStep(
      digitalProductData
    )

    const { digital_product_medias } = createDigitalProductMediasStep(
      transform({
        digital_product,
        medias
      },
      (data) => ({
        medias: data.medias.map((media) => ({
          ...media,
          digital_product_id: data.digital_product.id
        }))
      })
      )
    )

    // Link based on what's provided:
    // 1. If variant_id provided -> link to variant (for downloadable PDFs)
    // 2. If product_id provided -> link to product (for templates)
    // 3. If new product created -> link to product (for templates)
    const linkSteps = transform(
      {
        variant_id: input.variant_id,
        product_id: input.product_id,
        createdProductId,
        digital_product_id: digital_product.id
      },
      (data) => {
        const steps = []
        
        if (data.variant_id) {
          // Link to specific variant (for downloadable PDFs)
          steps.push({
            [DIGITAL_PRODUCT_MODULE]: {
              digital_product_id: data.digital_product_id
            },
            [Modules.PRODUCT]: {
              product_variant_id: data.variant_id
            }
          })
        } else if (data.product_id) {
          // Link to product (for templates)
          steps.push({
            [DIGITAL_PRODUCT_MODULE]: {
              digital_product_id: data.digital_product_id
            },
            [Modules.PRODUCT]: {
              product_id: data.product_id
            }
          })
        } else if (data.createdProductId) {
          // For newly created product, link to product_id
          // Templates should be linked at product level
          steps.push({
            [DIGITAL_PRODUCT_MODULE]: {
              digital_product_id: data.digital_product_id
            },
            [Modules.PRODUCT]: {
              product_id: data.createdProductId
            }
          })
        }
        
        return steps
      }
    )

    when(linkSteps, (steps) => {
      return steps && steps.length > 0
    }).then(() => {
      createRemoteLinkStep(linkSteps)
    })

    // Link customer (creator) to product
    // For new products, use createdProductId; for existing products, use product_id
    const customerLinkData = transform(
      {
        product_id: input.product_id,
        createdProductId,
        creator_id: input.digital_product.creator_id
      },
      (data) => {
        if (!data.creator_id) {
          return null
        }
        
        // Use product_id if provided (existing product), otherwise use createdProductId (new product)
        const finalProductId = data.product_id || data.createdProductId
        
        if (finalProductId) {
          return {
            product_id: finalProductId,
            customer_id: data.creator_id
          }
        }
        return null
      }
    )

    when(customerLinkData, (data) => {
      return data !== null
    }).then(() => {
      linkCustomerToProductStep(customerLinkData)
    })

    return new WorkflowResponse({
      digital_product: {
        ...digital_product,
        medias: digital_product_medias
      },
      product: productResult && productResult[0] ? productResult[0] : null
    })
  }
)

export default createDigitalProductWorkflow