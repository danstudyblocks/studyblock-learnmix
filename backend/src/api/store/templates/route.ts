import { DIGITAL_PRODUCT_MODULE } from "@/modules/digital-product";
import DigitalProductModuleService from "@/modules/digital-product/service";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

/**
 * GET /store/templates
 * Returns templates (digital products with isTemplate + template_data) for the home page.
 * Excludes blocks. Includes is_premium for Pro badge and Make it Your Own gating.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const digitalProductModuleService = req.scope.resolve(
      DIGITAL_PRODUCT_MODULE
    ) as DigitalProductModuleService;

    const digitalProducts =
      await digitalProductModuleService.listDigitalProducts();

    const templates = (digitalProducts || [])
      .filter((product: any) => {
        if (!product?.isTemplate || !product?.template_data) {
          return false;
        }
        const isBlock =
          product.category_top?.toLowerCase() === "blocks" ||
          product.category_sub?.toLowerCase() === "blocks" ||
          product.tags?.some((tag: string) =>
            tag?.toLowerCase?.()?.includes("block")
          );
        return !isBlock;
      })
      .map((product: any) => ({
        id: product.id,
        name: product.name,
        thumbnail: product.thumbnail,
        tags: product.tags,
        category_top: product.category_top,
        category_sub: product.category_sub,
        creator_id: product.creator_id,
        is_premium: !!product.is_premium,
        template_data: product.template_data,
        show_in_studio: product.show_in_studio,
        isTemplate: product.isTemplate,
        created_at: product.created_at,
        updated_at: product.updated_at,
      }))
      .sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

    res.json({ templates });
  } catch (error) {
    console.error("Error fetching store templates:", error);
    res.status(500).json({
      message: "Failed to fetch templates",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
