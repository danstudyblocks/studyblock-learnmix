import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product";
import DigitalProductModuleService from "@/modules/digital-product/service";

/**
 * GET /store/products-with-templates
 * Returns product IDs that have at least one linked digital_product with isTemplate and template_data.
 * Also returns premium_product_ids for products linked to a premium template (for Pro badge).
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const digitalProductModuleService = req.scope.resolve(
      DIGITAL_PRODUCT_MODULE
    ) as DigitalProductModuleService;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const digitalProducts =
      await digitalProductModuleService.listDigitalProducts();

    const templateDigitalProducts = (digitalProducts || []).filter(
      (dp: any) =>
        dp?.isTemplate === true &&
        dp?.template_data != null &&
        dp?.template_data !== ""
    );

    const templateDpIds = templateDigitalProducts.map((dp: any) => dp.id);
    const premiumDpIds = new Set(
      templateDigitalProducts
        .filter((dp: any) => dp?.is_premium === true)
        .map((dp: any) => dp.id)
    );

    if (templateDpIds.length === 0) {
      return res.json({
        product_ids: [],
        premium_product_ids: [],
      });
    }

    const productIds = new Set<string>();
    const premiumProductIds = new Set<string>();

    const addProduct = (productId: string, dpId: string) => {
      if (productId) {
        productIds.add(productId);
        if (premiumDpIds.has(dpId)) {
          premiumProductIds.add(productId);
        }
      }
    };

    // Product-level link: digital_product_product
    try {
      const { data: productLinks } = await query.graph({
        entity: "digital_product_product",
        fields: ["product_id", "digital_product_id"],
        filters: {
          digital_product_id: templateDpIds,
        },
      });
      (productLinks || []).forEach((link: any) => {
        addProduct(link.product_id, link.digital_product_id);
      });
    } catch (e) {
      // Link entity might not exist in all setups
    }

    // Variant-level link: digital_product_variant -> product_variant.product_id
    try {
      const { data: variantLinks } = await query.graph({
        entity: "digital_product_variant",
        fields: ["digital_product_id", "product_variant.product_id"],
        filters: {
          digital_product_id: templateDpIds,
        },
      });
      (variantLinks || []).forEach((link: any) => {
        const productId = link.product_variant?.product_id;
        if (productId) {
          addProduct(productId, link.digital_product_id);
        }
      });
    } catch (e) {
      // Link entity might not exist in all setups
    }

    return res.json({
      product_ids: Array.from(productIds),
      premium_product_ids: Array.from(premiumProductIds),
    });
  } catch (error) {
    console.error("Error fetching products with templates:", error);
    return res.status(500).json({
      message: "Failed to fetch products with templates",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
