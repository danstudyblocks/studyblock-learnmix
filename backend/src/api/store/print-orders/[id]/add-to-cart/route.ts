import { MedusaResponse, MedusaStoreRequest } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import { IProductModuleService, ISalesChannelModuleService, IOrderModuleService } from "@medusajs/framework/types";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

type AddPrintOrderToCartParams = {
  id: string;
};

export const POST = async (
  req: MedusaStoreRequest<Record<string, unknown>, AddPrintOrderToCartParams>,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger");
  const orderId = req.params.id;

  if (!orderId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Order ID is required"
    );
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    const salesChannelModuleService: ISalesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL);
    const orderModuleService: IOrderModuleService = req.scope.resolve(Modules.ORDER);

    // Retrieve the order (which contains print order data in metadata)
    const order = await orderModuleService.retrieveOrder(orderId);
    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Order not found"
      );
    }

    // Extract print order data from order metadata
    const printOrderData = (order.metadata as any)?.print_order;
    if (!printOrderData) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Order does not contain print order data"
      );
    }

    // Get default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels();
    const defaultSalesChannel = salesChannels.find((sc: any) => sc.is_default) || salesChannels[0];

    // Get region to determine currency (default to GBP for UK)
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "currency_code"],
    });
    const region = regions?.find((r: any) => r.currency_code === "gbp") || regions?.[0];
    const currencyCode = region?.currency_code || "gbp";

    // Find or create a "Print Service" product
    // This is a generic product for all print orders
    const printProductHandle = "print-service";
    let printProduct;
    
    // Try to find existing print product
    const { data: existingProducts } = await query.graph({
      entity: "product",
      fields: ["id", "handle", "variants.*", "variants.price_set.prices.*"],
      filters: {
        handle: printProductHandle
      }
    });

    if (existingProducts && existingProducts.length > 0) {
      printProduct = existingProducts[0];
      
      // Check if variants have prices (via price_set)
      const variantsNeedPrices = printProduct.variants?.some((v: any) => 
        !v.price_set_id || (!v.price_set?.prices || v.price_set.prices.length === 0)
      );
      if (variantsNeedPrices) {
        // Variants exist but don't have prices - delete the product and recreate
        // In production, you might want to update existing variants instead
        await productModuleService.deleteProducts([printProduct.id]);
        printProduct = null; // Will be created below
      } else {
        // Product exists and has prices, use it
        printProduct = existingProducts[0];
      }
    }
    
    // Create product with proper pricing if it doesn't exist
    if (!printProduct) {
    // Prices are in standard currency units (not pence)
    // Medusa v2 expects prices in standard currency units
    const { result } = await createProductsWorkflow(req.scope).run({
      input: {
        products: [{
          title: "Print Service",
          handle: printProductHandle,
          description: "Custom print service for your designs",
          status: "published",
          options: [{
            title: "Print Type",
            values: ["A1 Poster", "A2 Poster", "A3 Poster", "100 Postcards", "150 Stickers", "300 Stickers", "650 Stickers", "100 Books"]
          }],
          variants: [
            // Prices are stored in standard currency units
            { title: "A1 Poster", options: { "Print Type": "A1 Poster" }, prices: [{ amount: 8.95, currency_code: currencyCode }], manage_inventory: false }, // £8.95
            { title: "A2 Poster", options: { "Print Type": "A2 Poster" }, prices: [{ amount: 6.00, currency_code: currencyCode }], manage_inventory: false }, // £6.00
            { title: "A3 Poster", options: { "Print Type": "A3 Poster" }, prices: [{ amount: 3.95, currency_code: currencyCode }], manage_inventory: false }, // £3.95
            { title: "100 Postcards", options: { "Print Type": "100 Postcards" }, prices: [{ amount: 20.00, currency_code: currencyCode }], manage_inventory: false }, // £20.00
            { title: "150 Stickers", options: { "Print Type": "150 Stickers" }, prices: [{ amount: 7.50, currency_code: currencyCode }], manage_inventory: false }, // £7.50
            { title: "300 Stickers", options: { "Print Type": "300 Stickers" }, prices: [{ amount: 14.00, currency_code: currencyCode }], manage_inventory: false }, // £14.00
            { title: "650 Stickers", options: { "Print Type": "650 Stickers" }, prices: [{ amount: 28.00, currency_code: currencyCode }], manage_inventory: false }, // £28.00
            { title: "100 Books", options: { "Print Type": "100 Books" }, prices: [{ amount: 150.00, currency_code: currencyCode }], manage_inventory: false }, // £150.00
          ],
          sales_channels: defaultSalesChannel ? [defaultSalesChannel] : [],
        }]
      }
      });
      
      // Retrieve the full product with variants and prices
      // Sometimes prices need a moment to be available after creation
      // Wait longer to ensure price_sets are fully linked to variants
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let retries = 10;
      let newProducts;
      let allVariantsHavePrices = false;
      
      while (retries > 0 && !allVariantsHavePrices) {
        const queryResult = await query.graph({
          entity: "product",
          fields: ["id", "handle", "variants.*", "variants.price_set_id", "variants.price_set.prices.*"],
          filters: {
            id: result[0].id
          }
        });
        newProducts = queryResult.data;
        
        // Check if ALL variants have price_set_id and prices
        const variants = newProducts[0]?.variants || [];
        allVariantsHavePrices = variants.length > 0 && variants.every((v: any) => {
          const hasPriceSetId = !!v.price_set_id;
          const hasPrices = v.price_set?.prices && Array.isArray(v.price_set.prices) && v.price_set.prices.length > 0;
          return hasPriceSetId && hasPrices;
        });
        
        if (allVariantsHavePrices) {
          break;
        }
        
        // Wait longer between retries (exponential backoff)
        const waitTime = retries > 5 ? 400 : 300;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retries--;
      }
      
      if (!allVariantsHavePrices) {
        logger.warn(`Product ${result[0].id} created but some variants may not have prices yet`);
      }
      
      printProduct = newProducts[0];
    }

    // Get the variant based on print type and quantity from metadata
    const printType = String(printOrderData.product_type || printOrderData.metadata?.product_type || "poster");
    const quantity = Number(printOrderData.quantity || printOrderData.metadata?.quantity || 1);
    
    // Map print type and quantity to variant title
    let variantTitle = "";
    if (printType.toLowerCase() === "a1" || printType.toLowerCase() === "a1 poster") {
      variantTitle = "A1 Poster";
    } else if (printType.toLowerCase() === "a2" || printType.toLowerCase() === "a2 poster") {
      variantTitle = "A2 Poster";
    } else if (printType.toLowerCase() === "a3" || printType.toLowerCase() === "a3 poster") {
      variantTitle = "A3 Poster";
    } else if (printType.toLowerCase() === "postcard" || printType.toLowerCase() === "postcards") {
      if (quantity === 100) {
        variantTitle = "100 Postcards";
      } else {
        variantTitle = "100 Postcards"; // Default to 100 postcards
      }
    } else if (printType.toLowerCase() === "sticker" || printType.toLowerCase() === "stickers") {
      if (quantity === 150) {
        variantTitle = "150 Stickers";
      } else if (quantity === 300) {
        variantTitle = "300 Stickers";
      } else if (quantity === 650) {
        variantTitle = "650 Stickers";
      } else {
        variantTitle = "150 Stickers"; // Default to 150 stickers
      }
    } else if (printType.toLowerCase() === "book" || printType.toLowerCase() === "books") {
      if (quantity === 100) {
        variantTitle = "100 Books";
      } else {
        variantTitle = "100 Books"; // Default to 100 books
      }
    } else {
      // Fallback to A3 Poster
      variantTitle = "A3 Poster";
    }
    
    const variant = printProduct.variants?.find((v: any) => 
      v.title.toLowerCase() === variantTitle.toLowerCase()
    ) || printProduct.variants?.[0];

    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Print variant not found"
      );
    }

    // Verify variant has prices before returning
    // In Medusa v2, prices are linked through price_sets
    // Sometimes it takes a moment for price_set_id to be linked to the variant
    let retries = 10;
    let variantPriceData = null;
    let hasPriceSet = false;

    while (retries > 0 && !hasPriceSet) {
      const { data: variantWithPriceSet } = await query.graph({
        entity: "product_variant",
        fields: ["id", "title", "price_set_id", "price_set.prices.*"],
        filters: {
          id: variant.id
        }
      });

      variantPriceData = variantWithPriceSet?.[0];
      
      if (variantPriceData && variantPriceData.price_set_id) {
        // Check if price_set has prices
        const priceSetPrices = variantPriceData.price_set?.prices || [];
        if (priceSetPrices.length > 0) {
          hasPriceSet = true;
          break;
        }
      }

      if (retries > 1) {
        // Wait before retrying (longer wait for first few retries)
        await new Promise(resolve => setTimeout(resolve, retries > 5 ? 300 : 200));
      }
      retries--;
    }

    if (!hasPriceSet || !variantPriceData || !variantPriceData.price_set_id) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Variant ${variant.id} does not have a price_set linked. Prices may not be fully set up yet. Please try again in a moment.`
      );
    }

    const priceSetPrices = variantPriceData.price_set?.prices || [];
    if (priceSetPrices.length === 0) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Variant ${variant.id} has a price_set but no prices are configured. Please ensure prices were created correctly.`
      );
    }

    logger.info(`Variant ${variant.id} has ${priceSetPrices.length} price(s) configured`);

    res.json({
      variant_id: variant.id,
      quantity,
      order_id: orderId,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    logger.error(
      `Failed to prepare print order for cart: ${message}`,
      error
    );

    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to prepare print order for cart: ${message}`
    );
  }
};

