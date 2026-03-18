import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import {
  CreateProductWorkflowInputDTO,
  IProductModuleService,
  ISalesChannelModuleService,
} from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { MedusaError } from "@medusajs/framework/utils";

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductWorkflowInputDTO>,
  res: MedusaResponse
) => {
  try {
    console.log("Incoming POST request to create product.");
    console.log("Request body:", req.body);
    
    const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    //@ts-ignore
    const files = req.files as Express.Multer.File[];

    // Validate uploaded files
    if (!files?.length) {
      console.warn("No files were uploaded.");
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "No files were uploaded");
    }
    console.log("Uploaded files:", files);

    // Upload files to S3 (or configured storage)
    const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: files.map((file) => ({
          filename: file.originalname,
          mimeType: file.mimetype,
          content: file.buffer,
          access: "public", // Use "public" access for thumbnails and images
        })),
      },
    });

    // Extract the first uploaded file as the thumbnail
    const thumbnailUrl = uploadedFiles[0]?.url;
    console.log("Thumbnail URL:", thumbnailUrl);

    // Use all uploaded files as images
    const imageUrls = uploadedFiles.map((file) => file.url);
    console.log("Image URLs:", imageUrls);

    // Retrieve product services
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    const salesChannelModuleService: ISalesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL);

    // Retrieve sales channels and get default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels();
    const defaultSalesChannel = salesChannels.find((sc: any) => sc.is_default) || salesChannels[0];
    console.log("Available sales channels:", salesChannels);
    console.log("Default sales channel:", defaultSalesChannel);

    // Retrieve creator (customer) information
    const customerId = req.auth_context.actor_id;
    console.log("Customer ID:", customerId);

    const customer = await req.scope.resolve(Modules.CUSTOMER).retrieveCustomer(customerId);
    console.log("Customer details:", customer);

    // Parse the stringified JSON fields manually since validation middleware might not work with FormData
    let parsedOptions = [];
    let parsedVariants = [];
    
    try {
      parsedOptions = req.body.options ? JSON.parse(req.body.options) : [];
    } catch (error) {
      console.warn("Failed to parse options:", error);
      parsedOptions = [];
    }
    
    try {
      parsedVariants = req.body.variants ? JSON.parse(req.body.variants) : [];
    } catch (error) {
      console.warn("Failed to parse variants:", error);
      parsedVariants = [];
    }

    // Ensure variants have manage_inventory set to false (print on demand)
    const variantsWithDefaults = parsedVariants.map((variant: any) => ({
      ...variant,
      manage_inventory: false,
    }));

    // Prepare product data with proper structure for Medusa
    const productData = {
      title: req.body.title,
      description: req.body.description || "",
      status: req.body.status || "draft",
      thumbnail: thumbnailUrl,
      images: imageUrls.map((url) => ({ url })),
      options: parsedOptions,
      variants: variantsWithDefaults,
      sales_channels: defaultSalesChannel ? [defaultSalesChannel] : salesChannels,
    };

    console.log("Parsed options:", parsedOptions);
    console.log("Parsed variants:", parsedVariants);

    console.log("Creating product with the following details:", productData);

    const { result } = await createProductsWorkflow(req.scope).run({
      input: {
        products: [productData],
      },
    });

    console.log("Product created successfully:", result);

    // Link the product to the customer
    await remoteLink.create({
      [Modules.PRODUCT]: { product_id: result[0].id },
      [Modules.CUSTOMER]: { customer_id: customer.id }
    });

    // Return created product details
    const product = await productModuleService.retrieveProduct(result[0].id);
    console.log("Final product details:", product);

    res.json({
      success: true,
      message: "Product uploaded and linked to customer successfully",
      product,
    });
  } catch (error) {
    console.error("Error in creating product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }
};
