import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const creatorId = req.params.id;

  if (!creatorId) {
    return res.status(400).json({
      message: "Creator ID is required",
    });
  }

  try {
    console.log('Fetching products for creator:', creatorId);

    // Query all products with customer relationship
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
        "customer.*",
      ],
    });

    console.log('Total products found:', allProducts?.length || 0);
    
    // Log first few products to see their structure
    if (allProducts && allProducts.length > 0) {
      console.log('Sample product structure:', {
        id: allProducts[0].id,
        title: allProducts[0].title,
        has_customer: !!allProducts[0].customer,
        customer_id: allProducts[0].customer?.id,
        metadata_creator_id: allProducts[0].metadata?.creator_id,
        metadata_creator_name: allProducts[0].metadata?.creator_name,
      });
    }

    // Filter products by customer relationship OR metadata.creator_id
    const creatorProducts = (allProducts || []).filter((product: any) => {
      const matchesCustomer = product.customer?.id === creatorId;
      const matchesMetadataId = product.metadata?.creator_id === creatorId;
      
      if (matchesCustomer || matchesMetadataId) {
        console.log('Product matched:', product.title, {
          by_customer_relationship: matchesCustomer,
          by_metadata: matchesMetadataId
        });
      }
      
      return matchesCustomer || matchesMetadataId;
    });

    console.log('Creator products found:', creatorProducts.length);

    // Get creator info from first product or fetch customer directly
    let creatorInfo = null;
    const buildCreatorName = (c: { first_name?: string; last_name?: string; email?: string; metadata?: { username?: string } }) =>
      (c.metadata?.username?.trim()) ||
      `${c.first_name || ''} ${c.last_name || ''}`.trim() ||
      c.email ||
      '';

    if (creatorProducts.length > 0 && creatorProducts[0].customer) {
      const customer = creatorProducts[0].customer;
      creatorInfo = {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        name: buildCreatorName(customer),
        avatar_url: customer.avatar_url,
        metadata: customer.metadata,
      };
    } else {
      // Try to fetch customer info directly
      try {
        const { data: customers } = await query.graph({
          entity: "customer",
          fields: ["id", "email", "first_name", "last_name", "avatar_url", "metadata"],
          filters: { id: creatorId },
        });
        
        if (customers && customers.length > 0) {
          const customer = customers[0];
          creatorInfo = {
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            name: buildCreatorName(customer),
            avatar_url: customer.avatar_url,
            metadata: customer.metadata,
          };
        }
      } catch (err) {
        console.error('Error fetching customer:', err);
      }
    }

    return res.json({
      products: creatorProducts,
      creator: creatorInfo,
      total: creatorProducts.length,
      debug: {
        creatorId,
        totalProductsInDb: allProducts?.length || 0,
        matchedProducts: creatorProducts.length,
      }
    });
  } catch (error) {
    console.error("Error fetching creator products:", error);
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
