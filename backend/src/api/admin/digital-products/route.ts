import { 
  AuthenticatedMedusaRequest, 
  MedusaResponse
} from "@medusajs/framework"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"
import createDigitalProductWorkflow from "../../../workflows/create-digital-product"
import { CreateDigitalProductMediaInput } from "../../../workflows/create-digital-product/steps/create-digital-product-medias"
import { createDigitalProductsSchema } from "../../validation-schemas"
import DigitalProductModuleService from "@/modules/digital-product/service"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { 
    fields, 
    limit = 20, 
    offset = 0,
  } = req.validatedQuery || {}
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { 
    data: digitalProducts,
    metadata: { count, take, skip },
  } = await query.graph({
    entity: "digital_product",
    fields: [
      "*",
      "medias.*",
      "product_variant.*",
      ...(fields || []),
    ],
    pagination: {
      skip: offset,
      take: limit,
    },
  })
  console.log("GET DIGITALPRODUCTS", digitalProducts)

  res.json({
    digital_products: digitalProducts,
    count,
    limit: take,
    offset: skip,
  })
}

type CreateRequestBody = z.infer<
  typeof createDigitalProductsSchema
>

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateRequestBody>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [shippingProfile] } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const { result } = await createDigitalProductWorkflow(
    req.scope
  ).run({
    input: {
      digital_product: {
        name: req.validatedBody.name,
        creator_id: req.validatedBody.creator_id,
        is_premium: req.validatedBody.is_premium,
        template_data: req.validatedBody.template_data,
        show_in_studio: req.validatedBody.show_in_studio,
        category_top: req.validatedBody.category_top, 
        category_sub: req.validatedBody.category_sub,
        tags: req.validatedBody.tags,
        thumbnail: req.validatedBody.thumbnail,
        isTemplate: req.validatedBody.isTemplate,
        medias: req.validatedBody.medias.map((media) => ({
          fileId: media.file_id,
          mimeType: media.mime_type,
          ...media
        })) as Omit<CreateDigitalProductMediaInput, "digital_product_id">[]
      },
      product: {
        ...req.validatedBody.product
        // shipping_profile_id: shippingProfile.id,
      }
    }
  })
  res.json({
    digital_product: result.digital_product
  })
}