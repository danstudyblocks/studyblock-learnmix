import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // Get the authenticated customer
  const customerId = req.auth_context?.actor_id;

  if (!customerId) {
    return res.status(401).json({
      message: "Unauthorized - Please log in",
    });
  }

  try {
    // First, get customer details to match by name as fallback
    const { data: customerData } = await query.graph({
      entity: "customer",
      fields: ["id", "email", "first_name", "last_name"],
      filters: {
        id: customerId,
      },
    });

    const customer = customerData?.[0];
    const customerFullName = customer 
      ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
      : '';
    const customerEmail = customer?.email || '';

    console.log('Fetching products for customer:', {
      customerId,
      customerFullName,
      customerEmail
    });

    // Query all products
    const { data: allProducts } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "thumbnail",
        "status",
        "created_at",
        "updated_at",
        "metadata",
        "variants.id",
      ],
    });

    console.log('Total products found:', allProducts?.length || 0);

    // Get all variant IDs
    const variantIds = allProducts?.flatMap((product: any) => 
      product.variants?.map((v: any) => v.id) || []
    ) || [];

    console.log('Total variant IDs:', variantIds.length);

    // Fetch digital products for these variants in batches to avoid query size issues
    const batchSize = 100;
    const digitalProducts: any[] = [];
    
    for (let i = 0; i < variantIds.length; i += batchSize) {
      const batch = variantIds.slice(i, i + batchSize);
      try {
        const { data: dpData } = await query.graph({
          entity: "digital_product",
          fields: ["id", "creator_id", "product_variant_id"],
          filters: {
            product_variant_id: batch,
          },
        });
        if (dpData) {
          digitalProducts.push(...dpData);
        }
      } catch (error) {
        console.error('Error fetching digital products batch:', error);
      }
    }

    console.log('Digital products found:', digitalProducts.length);

    // Create a map of variant_id -> creator_id
    const variantCreatorMap = new Map();
    digitalProducts.forEach((dp: any) => {
      if (dp.product_variant_id && dp.creator_id) {
        variantCreatorMap.set(dp.product_variant_id, dp.creator_id);
      }
    });

    // Filter products by creator_id OR creator_name OR creator_email matching customer
    const customerProducts = (allProducts || []).filter((product: any) => {
      // Check if metadata.creator_id matches
      if (product.metadata?.creator_id === customerId) {
        console.log('Product matched by metadata.creator_id:', product.title);
        return true;
      }
      
      // Check if any variant's digital_product has matching creator_id
      if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          const creatorId = variantCreatorMap.get(variant.id);
          if (creatorId === customerId) {
            console.log('Product matched by digital_product.creator_id:', product.title);
            return true;
          }
        }
      }
      
      // Check if metadata.creator_name matches customer name
      if (customerFullName && product.metadata?.creator_name) {
        const creatorName = product.metadata.creator_name.toLowerCase();
        const customerName = customerFullName.toLowerCase();
        if (creatorName === customerName || creatorName.includes(customerName)) {
          console.log('Product matched by creator_name:', product.title);
          return true;
        }
      }
      
      // Check if metadata.creator_email matches
      if (customerEmail && product.metadata?.creator_email) {
        const creatorEmail = product.metadata.creator_email.toLowerCase();
        if (creatorEmail === customerEmail.toLowerCase()) {
          console.log('Product matched by creator_email:', product.title);
          return true;
        }
      }
      
      return false;
    });

    console.log('Customer products found:', customerProducts.length);

    return res.json({
      products: customerProducts,
      debug: {
        customerId,
        customerFullName,
        customerEmail,
        totalProducts: allProducts?.length || 0,
        matchedProducts: customerProducts.length,
      }
    });
  } catch (error) {
    console.error("Error fetching customer products:", error);
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
