//@ts-nocheck
import {
    AuthenticatedMedusaRequest,
    MedusaResponse
} from "@medusajs/framework"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import createDigitalProductWorkflow from "../../../workflows/create-digital-product"
import { CreateDigitalProductMediaInput } from "../../../workflows/create-digital-product/steps/create-digital-product-medias"

export const POST = async (
    req: AuthenticatedMedusaRequest<any>,
    res: MedusaResponse
) => {
    try {
        const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

        const files = req.files as Express.Multer.File[];

        if (!files?.length) {
            return res.status(400).json({ error: "Template file is required." })
        }

        const themeFile = files[0]
        const themeJson = themeFile.buffer.toString()

        // Upload the theme file to S3
        const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
            input: {
                files: [{
                    filename: themeFile.originalname || `template_${Date.now()}.json`,
                    mimeType: themeFile.mimetype || "application/json",
                    content: Buffer.from(themeJson),
                    access: "public"
                }]
            }
        })

        const templateUrl = uploadedFiles[0]?.url
        console.log("Uploaded files:", uploadedFiles, "Template URL:", templateUrl)
        if (!templateUrl) {
            throw new MedusaError(
                MedusaError.Types.UNEXPECTED_STATE,
                "Failed to upload template file"
            )
        }

        const { data: [shippingProfile] } = await query.graph({
            entity: "shipping_profile",
            fields: ["id"],
        })

        // Get default sales channel
        const { data: salesChannels } = await query.graph({
            entity: "sales_channel",
            fields: ["id", "is_default"],
        })
        const defaultSalesChannel = salesChannels.find((sc: any) => sc.is_default) || salesChannels[0]

        // Parse JSON fields safely
        let product = req.body.product
        let medias = req.body.medias
        let name = req.body.name
        let creatorId = req.body.creator_id
        let tags = req.body.tags
        let category_top = req.body.category_top
        let category_sub = req.body.category_sub
        let thumbnail = req.body.thumbnail
        let productId = req.body.product_id // For linking to existing product
        let variantId = req.body.variant_id // For linking to specific variant

        try {

            // Parse other fields
            if (typeof product === "string") {
                product = JSON.parse(product)
            }
            if (typeof medias === "string") {
                medias = JSON.parse(medias)
            }
            if (typeof name === "string") {
                name = JSON.parse(name)
            }
            if (typeof creatorId === "string") {
                creatorId = JSON.parse(creatorId)
            }
            if (typeof tags === "string") {
                tags = JSON.parse(tags)
            }
            if (typeof category_top === "string") {
                category_top = JSON.parse(category_top)
            }
            if (typeof category_sub === "string") {
                category_sub = JSON.parse(category_sub)
            }
            if (typeof thumbnail === "string" && thumbnail.startsWith("{")) {
                thumbnail = JSON.parse(thumbnail)
            }
        } catch (err) {
            console.error("Parsing error:", err.message)
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Failed to parse input data: ${err.message}`
            )
        }

        // Log parsed inputs for debugging
        console.log("Parsed inputs:", {
            product,
            medias,
            name,
            creatorId,
            tags,
            category_top,
            category_sub,
            thumbnail: thumbnail ? "Present" : "Missing"
        })

        // Determine if we're linking to existing product or creating new one
        const isTemplate = req.body.isTemplate === "true" || req.body.isTemplate === true
        
        const workflowInput: any = {
            digital_product: {
                name: name,
                creator_id: creatorId,
                is_premium: req.body.is_premium === "true" || req.body.is_premium === true,
                template_data: templateUrl,
                isTemplate: isTemplate,
                show_in_studio: req.body.show_in_studio === "true" || req.body.show_in_studio === true,
                category_top: category_top || null,
                category_sub: category_sub || null,
                tags: tags || [],
                thumbnail: thumbnail || null,
                medias: medias?.map((media) => ({
                    fileId: media.file_id,
                    mimeType: media.mime_type,
                    ...media
                })) as Omit<CreateDigitalProductMediaInput, "digital_product_id">[]
            }
        }

        // If linking to existing product/variant
        if (productId) {
            workflowInput.product_id = productId
        } else if (variantId) {
            workflowInput.variant_id = variantId
        } else if (product) {
            // Create new product (backward compatibility)
            workflowInput.product = {
                ...product,
                variants: product.variants?.map((variant: any) => ({
                    ...variant,
                    manage_inventory: false,
                })) || [],
                sales_channels: defaultSalesChannel ? [defaultSalesChannel] : [],
            }
        }

        const { result } = await createDigitalProductWorkflow(req.scope).run({
            input: workflowInput
        })

        res.json({
            digital_product: result.digital_product
        })
    } catch (error) {
        console.error("Error in theme upload:", error)
        res.status(500).json({
            error: `An unexpected error occurred while processing the theme upload: ${error.message}`
        })
    }
}