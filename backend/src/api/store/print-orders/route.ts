import { MedusaResponse, MedusaStoreRequest } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import { IProductModuleService, ISalesChannelModuleService, ICartModuleService, IPricingModuleService } from "@medusajs/framework/types";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";

type CreatePrintOrderBody = {
  title?: string;
  design_snapshot: unknown;
  preview_image?: string;
  metadata?: Record<string, unknown>;
  customer_id?: string;
  cart_id?: string;
};

export const POST = async (
  req: MedusaStoreRequest<CreatePrintOrderBody>,
  res: MedusaResponse
) => {
  const logger = req.scope.resolve("logger");

  if (
    !req.body?.design_snapshot ||
    typeof req.body.design_snapshot !== "object"
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Design snapshot is required."
    );
  }

  const customerId =
    req.auth_context?.actor_id ??
    (typeof req.body.customer_id === "string" ? req.body.customer_id : null);

  if (!customerId) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Customer id is required to create a print order."
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: customers } = await query.graph({
      entity: "customer",
      fields: ["id", "email"],
      filters: { id: customerId },
    });

    if (!customers?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Invalid customer id provided."
      );
    }

    const customerEmail = customers[0]?.email;

  // Get default region and sales channel
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
  });
  const region = regions?.find((r: any) => r.currency_code === "gbp") || regions?.[0];

  if (!region) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "No region found. Please configure regions first."
    );
  }

  const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
  const salesChannelModuleService: ISalesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL);
  const salesChannels = await salesChannelModuleService.listSalesChannels();
  const defaultSalesChannel = salesChannels.find((sc: any) => sc.is_default) || salesChannels[0];
  const currencyCode = region.currency_code;

  try {
    // Find or create print service product
    const printProductHandle = "print-service";
    let printProduct;
    
    const { data: existingProducts } = await query.graph({
      entity: "product",
      fields: ["id", "handle", "variants.*", "variants.price_set_id", "variants.price_set.prices.*"],
      filters: {
        handle: printProductHandle
      }
    });

    if (existingProducts && existingProducts.length > 0) {
      printProduct = existingProducts[0];
      const variantsNeedPrices = printProduct.variants?.some((v: any) => 
        !v.price_set_id || (!v.price_set?.prices || v.price_set.prices.length === 0)
      );
      
      // If product exists but variants don't have prices, log warning
      if (variantsNeedPrices) {
        logger.warn(`Product ${printProduct.id} variants don't have price_sets yet`);
      }
    }
    
    if (!printProduct) {
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
              // Prices are stored in standard currency units (not pence)
              // Medusa v2 expects prices in standard currency units
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

      // Query product with variants and price_sets
      const queryResult = await query.graph({
        entity: "product",
        fields: ["id", "handle", "variants.*", "variants.price_set_id", "variants.price_set.prices.*"],
        filters: {
          id: result[0].id
        }
      });
      
      printProduct = queryResult.data?.[0];
      
      if (!printProduct) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to retrieve created print product"
        );
      }
    }

    // Get variant based on print type and quantity
    const printType = String(req.body.metadata?.product_type || "poster");
    const quantity = Number(req.body.metadata?.quantity || 1);
    
    let variantTitle = "";
    if (printType.toLowerCase() === "a1" || printType.toLowerCase() === "a1 poster") {
      variantTitle = "A1 Poster";
    } else if (printType.toLowerCase() === "a2" || printType.toLowerCase() === "a2 poster") {
      variantTitle = "A2 Poster";
    } else if (printType.toLowerCase() === "a3" || printType.toLowerCase() === "a3 poster") {
      variantTitle = "A3 Poster";
    } else if (printType.toLowerCase() === "postcard" || printType.toLowerCase() === "postcards") {
      variantTitle = "100 Postcards";
    } else if (printType.toLowerCase() === "sticker" || printType.toLowerCase() === "stickers") {
      if (quantity === 150) {
        variantTitle = "150 Stickers";
      } else if (quantity === 300) {
        variantTitle = "300 Stickers";
      } else if (quantity === 650) {
        variantTitle = "650 Stickers";
      } else {
        variantTitle = "150 Stickers";
      }
    } else if (printType.toLowerCase() === "book" || printType.toLowerCase() === "books") {
      variantTitle = "100 Books";
    } else {
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

    // Get price_set data from variant (already included in product query)
    let priceSetPrices = variant.price_set?.prices || [];
    let variantPriceSetId = variant.price_set_id;

    // If price_set data is not available from product query, try querying directly
    if (!priceSetPrices.length && variantPriceSetId) {
      try {
        const { data: priceSets } = await query.graph({
          entity: "price_set",
          fields: ["id", "prices.*"],
          filters: {
            id: variantPriceSetId
          }
        });
        
        if (priceSets && priceSets.length > 0) {
          priceSetPrices = priceSets[0].prices || [];
        }
      } catch (error) {
        logger.warn(`Failed to query price_set ${variantPriceSetId} for variant ${variant.id}`);
      }
    }

    // If still no prices, try to get from price_set_id directly
    if (!priceSetPrices.length && variantPriceSetId) {
      try {
        const { data: priceSetData } = await query.graph({
          entity: "price_set",
          fields: ["prices.*"],
          filters: {
            id: variantPriceSetId
          }
        });
        
        if (priceSetData && priceSetData.length > 0 && priceSetData[0].prices) {
          priceSetPrices = priceSetData[0].prices;
        }
      } catch (error) {
        logger.warn(`Failed to query price_set prices for variant ${variant.id}`);
      }
    }

    // If we still don't have prices, use fallback prices based on variant title
    // These match the prices we set when creating the product (in standard currency units)
    let variantPriceAmount: number | null = null;
    if (!priceSetPrices.length) {
      const fallbackPrices: Record<string, number> = {
        "A1 Poster": 8.95,
        "A2 Poster": 6.00,
        "A3 Poster": 3.95,
        "100 Postcards": 20.00,
        "150 Stickers": 7.50,
        "300 Stickers": 14.00,
        "650 Stickers": 28.00,
        "100 Books": 150.00,
      };
      
      const variantTitleKey = variant.title || variantTitle;
      if (fallbackPrices[variantTitleKey]) {
        variantPriceAmount = fallbackPrices[variantTitleKey];
        logger.info(`Using fallback price ${variantPriceAmount} for variant ${variant.id} (${variantTitleKey})`);
      }
    }

    // If we still don't have price data, throw error
    if (!priceSetPrices.length && variantPriceAmount === null) {
      logger.error(
        `Variant ${variant.id} (${variant.title}) does not have price_set data available. ` +
        `Product ID: ${printProduct.id}. Price set ID: ${variantPriceSetId || 'none'}.`
      );
      
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `The print service product is still being set up. Please wait a moment and try again. ` +
        `If this issue persists, the product may need to be manually configured.`
      );
    }

    logger.info(`Variant ${variant.id} has price_set with ${priceSetPrices.length} price(s)`);

    // Create or get cart using query graph
    let cart;
    
    if (req.body.cart_id) {
      // Try to retrieve existing cart
      try {
        const { data: existingCarts } = await query.graph({
          entity: "cart",
          fields: ["id", "region_id", "customer_id"],
          filters: { id: req.body.cart_id }
        });
        if (existingCarts && existingCarts.length > 0) {
          cart = existingCarts[0];
        }
      } catch (error) {
        logger.warn(`Failed to retrieve cart ${req.body.cart_id}, creating new cart`);
      }
    }

    // Create new cart if needed using Cart module service
    if (!cart) {
      const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
      const createdCarts = await cartModuleService.createCarts({
        currency_code: currencyCode,
        region_id: region.id,
        customer_id: customerId,
        email: customerEmail,
        sales_channel_id: defaultSalesChannel?.id,
      });
      
      // createCarts returns an array of carts
      if (!createdCarts || (Array.isArray(createdCarts) && createdCarts.length === 0)) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to create cart"
        );
      }
      
      const createdCart = Array.isArray(createdCarts) ? createdCarts[0] : createdCarts;
      const cartId = createdCart?.id;
      
      if (!cartId) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Created cart does not have an id"
        );
      }
      
      // Query the cart to get the full cart object
      const { data: queriedCarts } = await query.graph({
        entity: "cart",
        fields: ["id", "region_id", "customer_id"],
        filters: { id: cartId }
      });
      
      if (!queriedCarts || queriedCarts.length === 0) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Failed to retrieve created cart"
        );
      }
      
      cart = queriedCarts[0];
      logger.info(`Created new cart ${cart.id} for customer ${customerId}`);
    }

    // Add line item to cart with print order data in metadata
    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const printOrderData = {
      title: req.body.title ?? null,
      design_snapshot: req.body.design_snapshot,
      preview_image: req.body.preview_image ?? null,
      metadata: req.body.metadata || {},
    };

    // Get the price for the variant
    let unitPrice: number;
    if (variantPriceAmount !== null) {
      unitPrice = variantPriceAmount;
    } else {
      const variantPrice = priceSetPrices.find((p: any) => p.currency_code === currencyCode);
      if (!variantPrice) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `No price found for variant ${variant.id} in currency ${currencyCode}`
        );
      }
      unitPrice = variantPrice.amount;
    }

    await cartModuleService.addLineItems(cart.id, [{
      variant_id: variant.id,
      quantity: Number(quantity),
      title: variant.title || variantTitle,
      unit_price: unitPrice,
      metadata: {
        print_order: printOrderData,
      },
    }]);

    logger.info(`Added variant ${variant.id} to cart ${cart.id}`);

    // Return cart ID for frontend to redirect to checkout
    res.json({
      cart_id: cart.id,
      variant_id: variant.id,
      quantity: quantity,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown print order error";

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
